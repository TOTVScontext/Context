import { useReducer, useRef, useCallback, useEffect, useMemo } from 'react'
import { AnalysisService } from '../services/analysis.service.js'

const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8MB
const ALLOWED_EXTS = new Set(['json', 'csv'])

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
}

const initialState = {
  status: 'idle', // idle | loading | success | error
  stage: null,
  error: null,
  result: null,
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.START:
      return { ...state, status: 'loading', stage: STAGES.READING, error: null }

    case ACTIONS.SET_STAGE:
      return { ...state, stage: action.payload }

    case ACTIONS.SUCCESS:
    case ACTIONS.FETCH_SUCCESS:
      return { status: 'success', stage: null, error: null, result: action.payload }

    case ACTIONS.ERROR:
    case ACTIONS.FETCH_ERROR:
      return { ...state, status: 'error', stage: null, error: action.payload }

    case ACTIONS.FETCH_START:
      return { ...state, status: 'loading', stage: null, error: null }

    case ACTIONS.RESET:
      return initialState

    default:
      return state
  }
}

function getExt(name = '') {
  return name.split('.').pop().toLowerCase()
}

/** Parser de CSV simples, tolerante a campos entre aspas com vírgulas internas. */
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

/** Lê o arquivo selecionado e converte no formato de transcrição aceito pela API. */
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

  // csv
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

export function useAnalysis() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const abortRef = useRef(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  const analyzeFile = useCallback(async (file, { title } = {}) => {
    if (!file) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    dispatch({ type: ACTIONS.START })

    try {
      const transcript = await fileToTranscript(file)

      dispatch({ type: ACTIONS.SET_STAGE, payload: STAGES.ANALYZING })

      const result = await AnalysisService.analyze({
        transcript,
        title,
        signal: controller.signal,
      })

      dispatch({ type: ACTIONS.SUCCESS, payload: result })
      return result
    } catch (err) {
      if (err.name === 'AbortError') return
      dispatch({ type: ACTIONS.ERROR, payload: err.message ?? 'Falha ao gerar a análise.' })
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
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message ?? 'Falha ao carregar a análise.' })
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    dispatch({ type: ACTIONS.RESET })
  }, [])

  const stageMessage = state.stage ? STAGE_MESSAGES[state.stage] : null

  return useMemo(() => ({
    status: state.status,
    isLoading: state.status === 'loading',
    stage: state.stage,
    stageMessage,
    error: state.error,
    result: state.result,
    analyzeFile,
    fetchAnalysis,
    reset,
  }), [state.status, state.stage, stageMessage, state.error, state.result, analyzeFile, fetchAnalysis, reset])
}