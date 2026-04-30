import { useState, useRef, useCallback } from 'react'
import { sendMessageStream } from '../services/chatService'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [chatId, setChatId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const abortRef = useRef(null)
  const messagesRef = useRef([])
  const chatIdRef = useRef(null)

  const _setMessages = useCallback((updater) => {
    setMessages(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      messagesRef.current = next
      return next
    })
  }, [])

  const _setChatId = useCallback((id) => {
    chatIdRef.current = id
    setChatId(id)
  }, [])

  const sendMessage = useCallback(async ({ message, files = [] }) => {
    if (!message.trim()) return

    setIsLoading(true)
    setError(null)

    const controller = new AbortController()
    abortRef.current = controller

    const historySnapshot = messagesRef.current

    _setMessages(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    let assistantText = ''

    try {
      await sendMessageStream({
        message,
        chatId: chatIdRef.current,
        history: historySnapshot,
        files,
        signal: controller.signal,

        onEvent: (event) => {
          if (event.type === 'token') {
            assistantText += event.token

            _setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: assistantText }
              return updated
            })
          }

          if (event.type === 'done' && event.chatId) {
            _setChatId(event.chatId)
            window.dispatchEvent(new CustomEvent('chat:created', { detail: event.chatId }))
          }
        },
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message ?? 'Erro ao enviar mensagem.')

        _setMessages(prev => {
          const updated = [...prev]
          if (updated.at(-1)?.role === 'assistant' && updated.at(-1).content === '') {
            updated.pop()
          }
          return updated
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [_setMessages, _setChatId])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    messagesRef.current = []
    chatIdRef.current = null
    setMessages([])
    setChatId(null)
    setError(null)
    setIsLoading(false)
  }, [])

  const loadChat = useCallback((history, id) => {
    messagesRef.current = history
    chatIdRef.current = id
    setMessages(history)
    setChatId(id)
    setError(null)
  }, [])

  return { messages, chatId, isLoading, error, sendMessage, stop, reset, loadChat }
}