const API_BASE = 'https://api-totvs-context.vercel.app/api/dashboard'

const CACHE_TTL_MS = 60_000

let _cache = null

function readCache() {
  return _cache && Date.now() - _cache.timestamp < CACHE_TTL_MS ? _cache : null
}

function writeCache(data) {
  _cache = { data, timestamp: Date.now() }
}

function invalidateCache() {
  _cache = null
}

class DashboardApiError extends Error {
  constructor(message, { status, retryAfter } = {}) {
    super(message)
    this.name = 'DashboardApiError'
    this.status = status
    this.retryAfter = retryAfter
  }
}

async function toApiError(res, fallback) {
  const body = await res.json().catch(() => null)
  const retryAfterHeader = res.headers.get('Retry-After')

  return new DashboardApiError(body?.error || fallback, {
    status: res.status,
    retryAfter: retryAfterHeader ? Number(retryAfterHeader) : undefined,
  })
}

export const DashboardService = {
  async get({ force = false, signal } = {}) {
    if (!force) {
      const cached = readCache()
      if (cached) return cached.data
    }

    const res = await fetch(`${API_BASE}?action=get`, {
      credentials: 'include',
      signal,
    })

    if (!res.ok) {
      throw await toApiError(res, 'Erro ao buscar a análise geral.')
    }

    const { dashboard = null } = await res.json()
    writeCache(dashboard)

    return dashboard
  },

  async generate({ signal } = {}) {
    const res = await fetch(`${API_BASE}?action=generate`, {
      method: 'POST',
      credentials: 'include',
      signal,
    })

    if (!res.ok) {
      throw await toApiError(res, 'Erro ao gerar a análise geral.')
    }

    const data = await res.json()
    if (data?.status === 'completed') invalidateCache()

    return data
  },
}

export { DashboardApiError }