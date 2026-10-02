import { useReducer, useRef, useCallback, useEffect, useMemo } from 'react'
import { DashboardService } from '../services/dashboard.service.js'

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  GENERATE_START: 'GENERATE_START',
  GENERATE_DONE: 'GENERATE_DONE',
  GENERATE_UP_TO_DATE: 'GENERATE_UP_TO_DATE',
  GENERATE_ERROR: 'GENERATE_ERROR',
}

const initialState = {
  status: 'idle',
  error: null,
  dashboard: null,

  generateStatus: 'idle',
  generateMessage: null,
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, status: state.status === 'success' ? 'success' : 'loading', error: null }

    case ACTIONS.FETCH_SUCCESS:
      return { ...state, status: 'success', error: null, dashboard: action.payload }

    case ACTIONS.FETCH_ERROR:
      return { ...state, status: 'error', error: action.payload }

    case ACTIONS.GENERATE_START:
      return { ...state, generateStatus: 'loading', generateMessage: null }

    case ACTIONS.GENERATE_DONE:
      return { ...state, generateStatus: 'idle', generateMessage: null }

    case ACTIONS.GENERATE_UP_TO_DATE:
      return { ...state, generateStatus: 'up_to_date', generateMessage: action.payload }

    case ACTIONS.GENERATE_ERROR:
      return { ...state, generateStatus: 'error', generateMessage: action.payload }

    default:
      return state
  }
}

function toErrorMessage(err, fallback) {
  if (err?.name === 'AbortError') return null
  if (err?.status === 429 && err?.retryAfter) {
    return `Muitas requisições. Tente novamente em ${err.retryAfter}s.`
  }
  return err?.message ?? fallback
}

export function useDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const generateAbortRef = useRef(null)

  useEffect(() => () => generateAbortRef.current?.abort(), [])

  const fetchDashboard = useCallback(async (opts) => {
    dispatch({ type: ACTIONS.FETCH_START })

    try {
      const dashboard = await DashboardService.get(opts)
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: dashboard })
      return dashboard
    } catch (err) {
      const message = toErrorMessage(err, 'Falha ao carregar a análise geral.')
      if (message !== null) dispatch({ type: ACTIONS.FETCH_ERROR, payload: message })
    }
  }, [])

  const generateDashboard = useCallback(async () => {
    generateAbortRef.current?.abort()
    const controller = new AbortController()
    generateAbortRef.current = controller

    dispatch({ type: ACTIONS.GENERATE_START })

    try {
      const result = await DashboardService.generate({ signal: controller.signal })

      if (result.status === 'up_to_date') {
        dispatch({ type: ACTIONS.GENERATE_UP_TO_DATE, payload: result.message })
        return result
      }

      dispatch({ type: ACTIONS.GENERATE_DONE })
      await fetchDashboard({ force: true })
      return result
    } catch (err) {
      const message = toErrorMessage(err, 'Falha ao gerar a análise geral.')
      if (message !== null) dispatch({ type: ACTIONS.GENERATE_ERROR, payload: message })
    }
  }, [fetchDashboard])

  return useMemo(() => ({
    status: state.status,
    error: state.error,
    dashboard: state.dashboard,
    fetchDashboard,

    generateStatus: state.generateStatus,
    generateMessage: state.generateMessage,
    isGenerating: state.generateStatus === 'loading',
    generateDashboard,
  }), [
    state.status, state.error, state.dashboard,
    state.generateStatus, state.generateMessage,
    fetchDashboard, generateDashboard,
  ])
}