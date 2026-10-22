const API_BASE = 'https://api-totvs-context.vercel.app/api/giveaway'

class GiveawayApiError extends Error {
    constructor(message, { status } = {}) {
        super(message)
        this.name = 'GiveawayApiError'
        this.status = status
    }
}

async function toApiError(res, fallback) {
    const body = await res.json().catch(() => null)
    return new GiveawayApiError(body?.error ?? fallback, { status: res.status })
}

export const GiveawayService = {
    async submit(data, { signal } = {}) {
        const res = await fetch(`${API_BASE}?action=submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal,
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            throw await toApiError(res, 'Erro ao registrar inscrição no sorteio.')
        }

        return res.json()
    },
}

export { GiveawayApiError }