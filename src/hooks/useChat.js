// src/hooks/useChat.js

import { useState, useRef, useCallback } from 'react'
import { sendMessageStream } from '../services/chatService'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [chatId, setChatId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const abortRef = useRef(null)

  const sendMessage = useCallback(async ({ message, files = [] }) => {
    if (!message) return

    setIsLoading(true)
    setError(null)

    const controller = new AbortController()
    abortRef.current = controller

    let assistantText = ''

    // otimista: adiciona mensagem do user
    setMessages(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }, // placeholder streaming
    ])

    try {
      await sendMessageStream({
        message,
        chatId,
        history: messages,
        files,
        signal: controller.signal,

        onEvent: (event) => {
          if (event.type === 'token') {
            assistantText += event.token

            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                role: 'assistant',
                content: assistantText,
              }
              return updated
            })
          }

          if (event.type === 'done') {
            if (event.chatId) {
              setChatId(event.chatId)
            }
          }
        },
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [chatId, messages])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
  }, [])

  const reset = useCallback(() => {
    setMessages([])
    setChatId(null)
    setError(null)
  }, [])

  return {
    messages,
    chatId,
    isLoading,
    error,
    sendMessage,
    stop,
    reset,
  }
}