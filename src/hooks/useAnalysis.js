import { useReducer, useRef, useCallback, useEffect, useMemo } from 'react'
import { AnalysisService } from '../services/analysis.service.js'

const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8MB
const ALLOWED_EXTS = new Set(['json', 'csv'])
const DEFAULT_PAGE_SIZE = 20

export const STAGES = {
  READING: 'reading',
  ANALYZING: 'analyzing',
}

const STAGE_MESSAGES = {
  [STAGES.READING]: 'Lendo e validando a transcrição...',
  [STAGES.ANALYZING]: 'Analisando comunicação, engajamento e sinais comerciais...',
}

const ACTIONS = {
  START: 'START',
  SET_STAGE: 'SET_STAGE',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  RESET: 'RESET',
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  LIST_START: 'LIST_START',
  LIST_SUCCESS: 'LIST_SUCCESS',
  LIST_ERROR: 'LIST_ERROR',
  DELETE_START: 'DELETE_START',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
  DELETE_ERROR: 'DELETE_ERROR',
}

const initialState = {
  status: 'idle', // idle | loading | success | error
  stage: null,
  error: null,
  result: null,

  list: {
    status: 'idle', // idle | loading | success | error
    items: [],
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    error: null,
  },

  deleteStatus: 'idle', // idle | loading | success | error
  deleteError: null,
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.START:
      return { ...state, status: 'loading', stage: STAGES.READING, error: null }

    case ACTIONS.SET_STAGE:
      return { ...state, stage: action.payload }

    case ACTIONS.SUCCESS:
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, status: 'success', stage: null, error: null, result: action.payload }

    case ACTIONS.ERROR:
    case ACTIONS.FETCH_ERROR:
      return { ...state, status: 'error', stage: null, error: action.payload }

    case ACTIONS.FETCH_START:
      return { ...state, status: 'loading', stage: null, error: null }

    case ACTIONS.RESET:
      return { ...initialState, list: state.list }

    case ACTIONS.LIST_START:
      return { ...state, list: { ...state.list, status: 'loading', error: null } }

    case ACTIONS.LIST_SUCCESS:
      return {
        ...state,
        list: {
          ...state.list,
          status: 'success',
          error: null,
          items: action.payload.analyses ?? [],
          total: action.payload.total ?? 0,
          page: action.payload.page ?? state.list.page,
          pageSize: action.payload.page_size ?? state.list.pageSize,
        },
      }

    case ACTIONS.LIST_ERROR:
      return { ...state, list: { ...state.list, status: 'error', error: action.payload } }

    case ACTIONS.DELETE_START:
      return { ...state, deleteStatus: 'loading', deleteError: null }

    case ACTIONS.DELETE_SUCCESS:
      return {
        ...state,
        deleteStatus: 'success',
        deleteError: null,
        list: {
          ...state.list,
          items: state.list.items.filter((item) => item.id !== action.payload),
          total: Math.max(0, state.list.total - 1),
        },
      }

    case ACTIONS.DELETE_ERROR:
      return { ...state, deleteStatus: 'error', deleteError: action.payload }

    default:
      return state
  }
}

function getExt(name = '') {
  return name.split('.').pop().toLowerCase()
}

function stripExtension(name = '') {
  const idx = name.lastIndexOf('.')
  return idx > 0 ? name.slice(0, idx) : name
}

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') { field += '"'; i++ }
      else if (char === '"') { inQuotes = false }
      else { field += char }
      continue
    }

    if (char === '"') { inQuotes = true; continue }
    if (char === ',') { row.push(field); field = ''; continue }
    if (char === '\r') continue
    if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue }

    field += char
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }

  const filtered = rows.filter(r => r.some(cell => cell.trim() !== ''))
  if (filtered.length === 0) return []

  const [header, ...body] = filtered
  return body.map(cells => {
    const obj = {}
    header.forEach((key, idx) => { obj[key.trim() || `coluna_${idx + 1}`] = cells[idx] ?? '' })
    return obj
  })
}

async function fileToTranscript(file) {
  const ext = getExt(file.name)

  if (!ALLOWED_EXTS.has(ext)) {
    throw new Error('Formato inválido. Envie um arquivo .json ou .csv.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Arquivo muito grande. O limite é 8MB.')
  }

  const text = await file.text()

  if (ext === 'json') {
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new Error('O arquivo JSON está mal formatado.')
    }
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('O JSON da transcrição precisa ser um objeto.')
    }
    return parsed
  }

  const rows = parseCsv(text)
  if (rows.length === 0) {
    throw new Error('O CSV está vazio ou não pôde ser interpretado.')
  }
  return {
    format: 'csv',
    source_filename: file.name,
    rows,
  }
}

/** Extrai uma mensagem de erro amigável, incluindo o retryAfter do rate limit quando presente */
function toErrorMessage(err, fallback) {
  if (err?.name === 'AbortError') return null
  if (err?.status === 429 && err?.retryAfter) {
    return `Muitas requisições. Tente novamente em ${err.retryAfter}s.`
  }
  return err?.message ?? fallback
}

export function useAnalysis() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const analyzeAbortRef = useRef(null)
  const listAbortRef = useRef(null)

  useEffect(() => () => {
    analyzeAbortRef.current?.abort()
    listAbortRef.current?.abort()
  }, [])

  const analyzeFile = useCallback(async (file, { title } = {}) => {
    if (!file) return

    analyzeAbortRef.current?.abort()
    const controller = new AbortController()
    analyzeAbortRef.current = controller

    dispatch({ type: ACTIONS.START })

    try {
      const transcript = await fileToTranscript(file)

      dispatch({ type: ACTIONS.SET_STAGE, payload: STAGES.ANALYZING })

      const finalTitle = title?.trim() || stripExtension(file.name)

      const result = await AnalysisService.analyze({
        transcript,
        title: finalTitle,
        signal: controller.signal,
      })

      dispatch({ type: ACTIONS.SUCCESS, payload: result })
      return result
    } catch (err) {
      const message = toErrorMessage(err, 'Falha ao gerar a análise.')
      if (message === null) return
      dispatch({ type: ACTIONS.ERROR, payload: message })
      throw err
    }
  }, [])

  const fetchAnalysis = useCallback(async (id, opts) => {
    if (!id) return

    dispatch({ type: ACTIONS.FETCH_START })
    try {
      const result = await AnalysisService.get(id, opts)
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: result })
      return result
    } catch (err) {
      const message = toErrorMessage(err, 'Falha ao carregar a análise.')
      if (message === null) return
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: message })
      throw err
    }
  }, [])

  const fetchList = useCallback(async (page = 1, pageSize = DEFAULT_PAGE_SIZE, opts = {}) => {
    listAbortRef.current?.abort()
    const controller = new AbortController()
    listAbortRef.current = controller

    dispatch({ type: ACTIONS.LIST_START })
    try {
      const result = await AnalysisService.list(page, pageSize, { ...opts, signal: controller.signal })
      dispatch({ type: ACTIONS.LIST_SUCCESS, payload: result })
      return result
    } catch (err) {
      const message = toErrorMessage(err, 'Falha ao listar as análises.')
      if (message === null) return
      dispatch({ type: ACTIONS.LIST_ERROR, payload: message })
      throw err
    }
  }, [])

  const refreshList = useCallback(() => (
    fetchList(state.list.page, state.list.pageSize, { force: true })
  ), [fetchList, state.list.page, state.list.pageSize])

  const deleteAnalysis = useCallback(async (id) => {
    if (!id) return

    dispatch({ type: ACTIONS.DELETE_START })
    try {
      const result = await AnalysisService.delete(id)
      dispatch({ type: ACTIONS.DELETE_SUCCESS, payload: id })
      return result
    } catch (err) {
      const message = toErrorMessage(err, 'Falha ao excluir a análise.')
      if (message === null) return
      dispatch({ type: ACTIONS.DELETE_ERROR, payload: message })
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    analyzeAbortRef.current?.abort()
    dispatch({ type: ACTIONS.RESET })
  }, [])

  const stageMessage = state.stage ? STAGE_MESSAGES[state.stage] : null

  return useMemo(() => ({
    // análise individual (upload → analyze / get)
    status: state.status,
    isLoading: state.status === 'loading',
    stage: state.stage,
    stageMessage,
    error: state.error,
    result: state.result,
    analyzeFile,
    fetchAnalysis,
    reset,

    // listagem paginada
    list: state.list.items,
    listTotal: state.list.total,
    listPage: state.list.page,
    listPageSize: state.list.pageSize,
    isListLoading: state.list.status === 'loading',
    listError: state.list.error,
    fetchList,
    refreshList,

    // exclusão
    isDeleting: state.deleteStatus === 'loading',
    deleteError: state.deleteError,
    deleteAnalysis,
  }), [
    state.status, state.stage, stageMessage, state.error, state.result,
    state.list, state.deleteStatus, state.deleteError,
    analyzeFile, fetchAnalysis, reset, fetchList, refreshList, deleteAnalysis,
  ])
}