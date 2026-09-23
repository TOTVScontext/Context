const API_BASE = 'https://api-totvs-context.vercel.app/api/analysis'

function buildHeaders() {
  return { 'Content-Type': 'application/json' }
}

// ─── Cache leve em memória (mesmo padrão do chat.service.js) ─────────────────

const _cache = {
  list: new Map(),
  get: new Map(),
}

const TTL = 1000 * 60 // 1 minuto

function isFresh(entry) {
  return entry && (Date.now() - entry.timestamp < TTL)
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

export const AnalysisService = {
  /**
   * Envia a transcrição para análise. O backend gera o relatório narrativo
   * e as métricas numéricas e persiste no Supabase.
   *
   * @param {{ transcript: object, meetingId?: string, title?: string, signal?: AbortSignal }} params
   */
  async analyze({ transcript, meetingId, title, signal }) {
    const res = await fetch(`${API_BASE}?action=analyze`, {
      method: 'POST',
      headers: buildHeaders(),
      credentials: 'include',
      signal,
      body: JSON.stringify({
        transcript,
        meeting_id: meetingId,
        title,
      }),
    })

    if (!res.ok) {
      throw new Error(await parseErrorResponse(res, 'Erro ao processar a análise da transcrição.'))
    }

    const data = await res.json()

    invalidateList()
    if (data?.id) invalidateAnalysis(data.id)

    return data
  },

  async get(id, { force = false } = {}) {
    if (!force) {
      const cached = getCache(_cache.get, id)
      if (cached) return cached
    }

    const res = await fetch(`${API_BASE}?action=get&id=${encodeURIComponent(id)}`, {
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error(await parseErrorResponse(res, 'Erro ao buscar a análise.'))
    }

    const data = await res.json()
    setCache(_cache.get, id, data)

    return data
  },

  async list(page = 1, pageSize = 20) {
    const key = `${page}-${pageSize}`
    const cached = getCache(_cache.list, key)
    if (cached) return cached

    const res = await fetch(`${API_BASE}?action=list&page=${page}&page_size=${pageSize}`, {
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error(await parseErrorResponse(res, 'Erro ao listar as análises.'))
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
      throw new Error(await parseErrorResponse(res, 'Erro ao excluir a análise.'))
    }

    const data = await res.json()

    invalidateList()
    invalidateAnalysis(id)

    return data
  },
}