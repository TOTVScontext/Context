import { useReducer, useRef, useCallback, useEffect, useMemo } from 'react'
import { sendMessageStream } from '../services/chatService'

const ACTIONS = {
  SEND_START: 'SEND_START',
  APPEND_TOKEN: 'APPEND_TOKEN',
  SET_CHAT_ID: 'SET_CHAT_ID',
  SEND_ERROR: 'SEND_ERROR',
  SEND_SETTLED: 'SEND_SETTLED',
  STOP: 'STOP',
  RESET: 'RESET',
  LOAD_CHAT: 'LOAD_CHAT',
}

const initialState = {
  messages: [],
  chatId: null,
  isLoading: false,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SEND_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        messages: [
          ...state.messages,
          { role: 'user', content: action.payload.message },
          { role: 'assistant', content: '' },
        ],
      }

    case ACTIONS.APPEND_TOKEN: {
      const messages = state.messages.slice()
      const lastIndex = messages.length - 1
      messages[lastIndex] = { role: 'assistant', content: action.payload.content }
      return { ...state, messages }
    }

    case ACTIONS.SET_CHAT_ID:
      return { ...state, chatId: action.payload.chatId }

    case ACTIONS.SEND_ERROR: {
      const messages = state.messages.slice()
      const last = messages.at(-1)
      if (last?.role === 'assistant' && last.content === '') messages.pop()
      return { ...state, messages, error: action.payload.message, isLoading: false }
    }

    case ACTIONS.SEND_SETTLED:
      return { ...state, isLoading: false }

    case ACTIONS.STOP:
      return { ...state, isLoading: false }

    case ACTIONS.RESET:
      return initialState

    case ACTIONS.LOAD_CHAT:
      return {
        ...state,
        messages: action.payload.history,
        chatId: action.payload.chatId,
        error: null,
      }

    default:
      return state
  }
}

export function useChat() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const abortRef = useRef(null)
  const messagesRef = useRef(state.messages)
  const chatIdRef = useRef(state.chatId)
  const streamBufferRef = useRef('')
  const rafRef = useRef(null)

  useEffect(() => {
    messagesRef.current = state.messages
  }, [state.messages])

  useEffect(() => {
    chatIdRef.current = state.chatId
  }, [state.chatId])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const flushStreamBuffer = useCallback(() => {
    rafRef.current = null
    dispatch({ type: ACTIONS.APPEND_TOKEN, payload: { content: streamBufferRef.current } })
  }, [])

  const scheduleFlush = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(flushStreamBuffer)
  }, [flushStreamBuffer])

  const sendMessage = useCallback(async ({ message, files = [] }) => {
    if (!message?.trim()) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const historySnapshot = messagesRef.current
    streamBufferRef.current = ''

    dispatch({ type: ACTIONS.SEND_START, payload: { message } })

    try {
      await sendMessageStream({
        message,
        chatId: chatIdRef.current,
        history: historySnapshot,
        files,
        signal: controller.signal,

        onEvent: (event) => {
          if (event.type === 'token') {
            streamBufferRef.current += event.token
            scheduleFlush()
          }

          if (event.type === 'done' && event.chatId) {
            if (rafRef.current) {
              cancelAnimationFrame(rafRef.current)
              flushStreamBuffer()
            }
            chatIdRef.current = event.chatId
            dispatch({ type: ACTIONS.SET_CHAT_ID, payload: { chatId: event.chatId } })
            window.dispatchEvent(new CustomEvent('chat:created', { detail: event.chatId }))
          }
        },
      })

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        flushStreamBuffer()
      }
    } catch (err) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (err.name !== 'AbortError') {
        dispatch({ type: ACTIONS.SEND_ERROR, payload: { message: err.message ?? 'Erro ao enviar mensagem.' } })
        return
      }
    } finally {
      if (abortRef.current === controller) {
        dispatch({ type: ACTIONS.SEND_SETTLED })
      }
    }
  }, [scheduleFlush, flushStreamBuffer])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    dispatch({ type: ACTIONS.STOP })
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    messagesRef.current = []
    chatIdRef.current = null
    dispatch({ type: ACTIONS.RESET })
  }, [])

  const loadChat = useCallback((history, id) => {
    abortRef.current?.abort()
    messagesRef.current = history
    chatIdRef.current = id
    dispatch({ type: ACTIONS.LOAD_CHAT, payload: { history, chatId: id } })
  }, [])

  return useMemo(
    () => ({
      messages: state.messages,
      chatId: state.chatId,
      isLoading: state.isLoading,
      error: state.error,
      sendMessage,
      stop,
      reset,
      loadChat,
    }),
    [state.messages, state.chatId, state.isLoading, state.error, sendMessage, stop, reset, loadChat]
  )
}