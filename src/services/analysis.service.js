const API_BASE = 'https://api-totvs-context.vercel.app/api/analysis'

const CACHE_TTL_MS = 60_000

const _cache = {
  list: new Map(),
  get: new Map(),
}

function buildHeaders() {
  return { 'Content-Type': 'application/json' }
}

function isFresh(entry) {
  return Boolean(entry) && (Date.now() - entry.timestamp < CACHE_TTL_MS)
}

function setCache(map, key, data) {
  map.set(key, { data, timestamp: Date.now() })
}

function getCache(map, key) {
  const entry = map.get(key)
  return isFresh(entry) ? entry.data : null
}

function invalidateList() {
  _cache.list.clear()
}

function invalidateAnalysis(id) {
  _cache.get.delete(id)
}

async function parseErrorResponse(res, fallback) {
  try {
    const body = await res.json()
    return body?.error || fallback
  } catch {
    return fallback
  }
}

/** Erro de aplicação com metadados de HTTP (status + retryAfter, quando aplicável) */
class AnalysisApiError extends Error {
  constructor(message, { status, retryAfter } = {}) {
    super(message)
    this.name = 'AnalysisApiError'
    this.status = status
    this.retryAfter = retryAfter
  }
}

async function toApiError(res, fallback) {
  const message = await parseErrorResponse(res, fallback)
  const retryAfterHeader = res.headers.get('Retry-After')
  return new AnalysisApiError(message, {
    status: res.status,
    retryAfter: retryAfterHeader ? Number(retryAfterHeader) : undefined,
  })
}

export const AnalysisService = {
  async analyze({ transcript, title, signal }) {
    const res = await fetch(`${API_BASE}?action=analyze`, {
      method: 'POST',
      headers: buildHeaders(),
      credentials: 'include',
      signal,
      body: JSON.stringify({ transcript, title }),
    })

    if (!res.ok) {
      throw await toApiError(res, 'Erro ao processar a análise da transcrição.')
    }

    const data = await res.json()

    invalidateList()
    if (data?.id) invalidateAnalysis(data.id)

    return data
  },

  async get(id, { force = false, signal } = {}) {
    if (!force) {
      const cached = getCache(_cache.get, id)
      if (cached) return cached
    }

    const res = await fetch(`${API_BASE}?action=get&id=${encodeURIComponent(id)}`, {
      credentials: 'include',
      signal,
    })

    if (!res.ok) {
      if (res.status === 404) invalidateAnalysis(id)
      throw await toApiError(res, 'Erro ao buscar a análise.')
    }

    const data = await res.json()
    setCache(_cache.get, id, data)

    return data
  },

  async list(page = 1, pageSize = 20, { force = false, signal } = {}) {
    const key = `${page}-${pageSize}`

    if (!force) {
      const cached = getCache(_cache.list, key)
      if (cached) return cached
    }

    const res = await fetch(
      `${API_BASE}?action=list&page=${page}&page_size=${pageSize}`,
      { credentials: 'include', signal },
    )

    if (!res.ok) {
      throw await toApiError(res, 'Erro ao listar as análises.')
    }

    const data = await res.json()
    setCache(_cache.list, key, data)

    return data
  },

  async delete(id) {
    const res = await fetch(`${API_BASE}?action=delete&id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!res.ok) {
      throw await toApiError(res, 'Erro ao excluir a análise.')
    }

    const data = await res.json()

    invalidateList()
    invalidateAnalysis(id)

    return data
  },
}

export { AnalysisApiError }