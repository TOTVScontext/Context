import { useEffect, useState, useCallback } from 'react'

let cachedUser = null
let lastFetch = 0
let pendingPromise = null

const CACHE_TTL = 1000 * 60 * 5 // 5 min

const listeners = new Set()

function notifyListeners(user) {
  listeners.forEach(fn => fn(user))
}

export function useUser() {
  const [user, setUserState] = useState(cachedUser)
  const [loading, setLoading] = useState(!cachedUser)
  const [error, setError] = useState(null)

  useEffect(() => {
    const listener = (newUser) => setUserState(newUser)
    listeners.add(listener)
    return () => listeners.delete(listener)
  }, [])

  const setUser = useCallback((newUser) => {
    cachedUser = newUser
    lastFetch = Date.now()
    notifyListeners(newUser)
  }, [])

  const fetchUser = useCallback(async () => {
    if (cachedUser && Date.now() - lastFetch < CACHE_TTL) {
      setUserState(cachedUser)
      setLoading(false)
      return
    }

    if (pendingPromise) {
      setLoading(true)
      try {
        const data = await pendingPromise
        setUserState(data)
      } catch (err) {
        setError(err.message)
        setUserState(null)
      } finally {
        setLoading(false)
      }
      return
    }

    setLoading(true)
    setError(null)

    pendingPromise = fetch('https://api-totvs-context.vercel.app/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            cachedUser = null
            lastFetch = 0
            notifyListeners(null)
            return null
          }
          throw new Error(`Erro ao buscar usuário: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()

        const normalizedUser = {
          id: data.id,
          email: data.email,
          profile: data.profile,
          settings: data.settings,
        }

        cachedUser = normalizedUser
        lastFetch = Date.now()
        notifyListeners(normalizedUser)

        return normalizedUser
      })
      .finally(() => {
        pendingPromise = null
      })

    try {
      const data = await pendingPromise
      setUserState(data)
    } catch (err) {
      setError(err.message)
      setUserState(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearUserCache = useCallback(() => {
    cachedUser = null
    lastFetch = 0
    notifyListeners(null)
  }, [])

  const refreshUser = useCallback(async () => {
    cachedUser = null
    lastFetch = 0
    await fetchUser()
  }, [fetchUser])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    user,
    setUser,
    loading,
    error,
    refreshUser,
    clearUserCache,
  }
}