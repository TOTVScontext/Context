import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { listNews, getNews } from '../services/news.service.js'
import { cacheKeys, ensureFetched, getSnapshot, subscribe } from './newsCache.js'

export function useNewsList({ page = 1, pageSize = 20, staleTime, enabled = true } = {}) {
    const key = cacheKeys.list(page, pageSize)
    const entry = useSyncExternalStore(subscribe(key), () => getSnapshot(key))

    const fetcher = useCallback(
        (force) => ensureFetched(key, () => listNews({ page, pageSize }), { staleTime, force }),
        [key, page, pageSize, staleTime],
    )

    useEffect(() => {
        if (!enabled) return
        fetcher(false).catch(() => { })
    }, [enabled, fetcher])

    return {
        news: entry.data?.news ?? [],
        total: entry.data?.total ?? 0,
        isLoading: entry.status === 'loading',
        isValidating: entry.status === 'loading' || entry.status === 'revalidating',
        error: entry.error,
        refetch: () => fetcher(true),
    }
}

export function useNewsItem(id, { staleTime, enabled = true } = {}) {
    const key = cacheKeys.item(id)
    const entry = useSyncExternalStore(subscribe(key), () => getSnapshot(key))

    const fetcher = useCallback(
        (force) => ensureFetched(key, () => getNews(id), { staleTime, force }),
        [key, id, staleTime],
    )

    useEffect(() => {
        if (!enabled || !id) return
        fetcher(false).catch(() => { })
    }, [enabled, id, fetcher])

    return {
        item: entry.data,
        isLoading: entry.status === 'loading',
        isValidating: entry.status === 'loading' || entry.status === 'revalidating',
        error: entry.error,
        refetch: () => fetcher(true),
    }
}