export class NewsApiError extends Error {
    constructor(message, status, payload) {
        super(message)
        this.name = 'NewsApiError'
        this.status = status
        this.payload = payload
    }
}

async function request(action, { query = {}, signal } = {}) {
    const params = new URLSearchParams({ action, ...query })

    const response = await fetch(`https://api-totvs-context.vercel.app/api/news?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        signal,
    })

    const isJson = response.headers.get('content-type')?.includes('application/json')
    const payload = isJson ? await response.json().catch(() => null) : null

    if (!response.ok) {
        throw new NewsApiError(payload?.error ?? `Falha na requisição (${response.status}).`, response.status, payload)
    }

    return payload
}

export function listNews({ page = 1, pageSize = 20, signal } = {}) {
    return request('list', { query: { page, page_size: pageSize }, signal })
}

export function getNews(id, { signal } = {}) {
    return request('get', { query: { id }, signal })
}