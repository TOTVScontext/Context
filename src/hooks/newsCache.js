const STALE_TIME_DEFAULT = 60_000

const store = new Map()
const listeners = new Map() 

function notify(key) {
  listeners.get(key)?.forEach((cb) => cb())
}

function getEntry(key) {
  return store.get(key) ?? { data: undefined, error: null, updatedAt: 0, status: 'idle', promise: null }
}

function setEntry(key, patch) {
  store.set(key, { ...getEntry(key), ...patch })
  notify(key)
}

export function getSnapshot(key) {
  return getEntry(key)
}

export function subscribe(key) {
  return (callback) => {
    if (!listeners.has(key)) listeners.set(key, new Set())
    listeners.get(key).add(callback)
    return () => listeners.get(key)?.delete(callback)
  }
}

export function ensureFetched(key, fetcher, { staleTime = STALE_TIME_DEFAULT, force = false } = {}) {
  const entry = getEntry(key)
  const isFresh = Date.now() - entry.updatedAt < staleTime

  if (entry.promise) return entry.promise
  if (isFresh && !force) return Promise.resolve(entry.data)

  const promise = fetcher()
    .then((data) => {
      setEntry(key, { data, error: null, updatedAt: Date.now(), status: 'success', promise: null })
      return data
    })
    .catch((error) => {
      setEntry(key, { error, status: 'error', promise: null })
      throw error
    })

  setEntry(key, { status: entry.data !== undefined ? 'revalidating' : 'loading', promise })
  return promise
}

export const cacheKeys = {
  list: (page, pageSize) => `list:${page}:${pageSize}`,
  item: (id) => `item:${id}`,
}