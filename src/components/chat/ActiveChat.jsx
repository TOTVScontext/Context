import { useEffect, useRef, useCallback, useState, useMemo, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import { useChat } from '../../hooks/useChat'
import BarChat from './BarChat'
import { ChatService } from '../../services/chatService'
import { AlertTriangle, Copy, Check } from '@geist-ui/icons'

function normaliseMarkdown(raw) {
  if (!raw) return ''

  return String(raw)
    .replace(/\r\n/g, '\n')
    .replace(/\u00A0/g, ' ')
    .trimEnd()
}

const FENCE_RE = /^ {0,3}(`{3,}|~{3,})/
const TABLE_ROW_RE = /^ {0,3}\|.*\|? *$/
const TABLE_DIVIDER_RE = /^ {0,3}\|?[ \t]*:?-{2,}:?[ \t]*(\|[ \t]*:?-{2,}:?[ \t]*)*\|? *$/
const LIST_ITEM_RE = /^ {0,3}([-*+]|\d{1,9}[.)])\s+/
const BLOCKQUOTE_RE = /^ {0,3}>/
const BLANK_RE = /^\s*$/

function splitMarkdownIntoBlocks(markdown) {
  if (!markdown) return []

  const lines = markdown.split('\n')
  const blocks = []
  let current = []
  let mode = 'none'
  let fenceToken = null

  const flush = () => {
    if (current.length) {
      const text = current.join('\n').trim()
      if (text) blocks.push(text)
      current = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (mode === 'fence') {
      current.push(line)
      if (line.trim() === fenceToken || new RegExp(`^ {0,3}${fenceToken[0]}{3,}\\s*$`).test(line)) {
        mode = 'none'
        flush()
      }
      continue
    }

    if (mode === 'math') {
      current.push(line)
      if (/^\s*\$\$\s*$/.test(line)) {
        mode = 'none'
        flush()
      }
      continue
    }

    const fenceMatch = line.match(FENCE_RE)
    if (fenceMatch) {
      flush()
      mode = 'fence'
      fenceToken = fenceMatch[1][0].repeat(3)
      current.push(line)
      continue
    }

    if (/^\s*\$\$/.test(line) && !/^\s*\$\$.*\$\$\s*$/.test(line)) {
      flush()
      mode = 'math'
      current.push(line)
      continue
    }

    if (BLANK_RE.test(line)) {
      if (mode === 'table' || mode === 'list' || mode === 'quote') {
        if (mode === 'list' && lines[i + 1] && (LIST_ITEM_RE.test(lines[i + 1]) || /^ {2,}\S/.test(lines[i + 1]))) {
          current.push(line)
          continue
        }
        mode = 'none'
        flush()
        continue
      }
      flush()
      continue
    }

    if (TABLE_ROW_RE.test(line) || TABLE_DIVIDER_RE.test(line)) {
      if (mode !== 'table') flush()
      mode = 'table'
      current.push(line)
      continue
    }

    if (LIST_ITEM_RE.test(line) || (mode === 'list' && /^ {2,}\S/.test(line))) {
      if (mode !== 'list') flush()
      mode = 'list'
      current.push(line)
      continue
    }

    if (BLOCKQUOTE_RE.test(line)) {
      if (mode !== 'quote') flush()
      mode = 'quote'
      current.push(line)
      continue
    }

    if (mode === 'table' || mode === 'list' || mode === 'quote') {
      mode = 'none'
      flush()
    }

    mode = 'none'
    current.push(line)
  }

  flush()
  return blocks
}

const CodeBlock = memo(({ className, children }) => {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef(null)
  const language = (className?.replace('language-', '') || 'plaintext').toLowerCase()

  const handleCopy = useCallback(async () => {

    const codeString = codeRef.current?.textContent ?? ''

    try {
      await navigator.clipboard.writeText(codeString)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* noop */ }
  }, [])

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__lang">{language}</span>
        <button type="button" className="code-block__copy" onClick={handleCopy} aria-label="Copiar código">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className={className}>
        <code ref={codeRef} className={className}>{children}</code>
      </pre>
    </div>
  )
})
CodeBlock.displayName = 'CodeBlock'

const markdownComponents = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')

    if (!match) {
      return (
        <code className="inline-code" {...props}>
          {children}
        </code>
      )
    }
    return <CodeBlock className={className}>{children}</CodeBlock>
  },
  a({ href, children, ...props }) {
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
  },
  table({ children, ...props }) {
    return (
      <div className="md-table-wrapper">
        <table {...props}>{children}</table>
      </div>
    )
  },
  img({ src, alt }) {
    return <img src={src} alt={alt || ''} loading="lazy" decoding="async" />
  },
  hr() {
    return <hr />
  },
  strong({ children }) {
    return <strong>{children}</strong>
  },
  em({ children }) {
    return <em>{children}</em>
  },
  blockquote({ children }) {
    return <blockquote>{children}</blockquote>
  },
}

const remarkPlugins = [remarkGfm, remarkMath]
const rehypePlugins = [rehypeKatex, [rehypeHighlight, { detect: true }]]

const MarkdownBlock = memo(
  ({ content }) => (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  ),
  (prev, next) => prev.content === next.content
)
MarkdownBlock.displayName = 'MarkdownBlock'

const MarkdownContent = memo(
  ({ content }) => {
    const normalised = useMemo(() => normaliseMarkdown(content), [content])
    const blocks = useMemo(() => splitMarkdownIntoBlocks(normalised), [normalised])

    return (
      <>
        {blocks.map((block, i) => (
          <MarkdownBlock key={i} content={block} />
        ))}
      </>
    )
  },
  (prev, next) => prev.content === next.content
)
MarkdownContent.displayName = 'MarkdownContent'

const ThinkingIndicator = () => (
  <div className="chat-ai chat-ai--thinking" aria-live="polite">
    <div className="thinking-dots">
      <span /><span /><span />
    </div>
  </div>
)

const MessageUser = memo(({ content }) => (
  <div className="chat-user">
    <p className="chat-bubble chat-bubble--user">{content}</p>
  </div>
))
MessageUser.displayName = 'MessageUser'

const MessageAssistant = memo(({ content, isStreaming }) => (
  <div className="chat-ai">
    <div className={`chat-bubble chat-bubble--ai${isStreaming ? ' chat-bubble--streaming' : ''}`}>
      <div className="markdown-content">
        <MarkdownContent content={content} />
      </div>
      {isStreaming && <span className="stream-cursor" aria-hidden="true" />}
    </div>
  </div>
))
MessageAssistant.displayName = 'MessageAssistant'

const ActiveChat = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { messages, isLoading, error, sendMessage, stop, reset, loadChat } = useChat()

  const bottomRef = useRef(null)
  const fetchAbortRef = useRef(null)
  const loadedIdRef = useRef(null)
  const skipNextLoadRef = useRef(false)

  useEffect(() => {
    if (!id || loadedIdRef.current === id) return

    if (skipNextLoadRef.current) {
      skipNextLoadRef.current = false
      loadedIdRef.current = id
      return
    }

    loadedIdRef.current = id

    fetchAbortRef.current?.abort()
    const controller = new AbortController()
    fetchAbortRef.current = controller

    reset()

    const load = async () => {
      try {
        const data = await ChatService.get(id)
        if (controller.signal.aborted) return

        if (data?.chat?.length) {
          loadChat(data.chat, id)
        }
      } catch {
        if (!controller.signal.aborted) {
          navigate('/chat/new', { replace: true })
        }
      }
    }

    load()

    return () => {
      controller.abort()
      loadedIdRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const isStreaming = isLoading && messages.at(-1)?.role === 'assistant'
  const isPending = isLoading && messages.at(-1)?.role === 'user'

  const handleSend = useCallback((payload) => {
    skipNextLoadRef.current = true
    sendMessage(payload)
  }, [sendMessage])

  const handleStop = useCallback(() => stop(), [stop])

  return (
    <main className="active-chat-main">
      <section
        className="active-chat-content"
        role="log"
        aria-live="polite"
        aria-label="Conversa"
      >
        {messages.map((msg, i) => {
          const isLast = i === messages.length - 1

          if (msg.role === 'user') {
            return <MessageUser key={i} content={msg.content} />
          }
          if (msg.role === 'assistant') {
            return (
              <MessageAssistant
                key={i}
                content={msg.content}
                isStreaming={isLast && isStreaming}
              />
            )
          }
          return null
        })}

        {isPending && <ThinkingIndicator />}

        {error && (
          <div className="chat-error" role="alert">
            <p><AlertTriangle size={15} /> {error}</p>
          </div>
        )}

        <div ref={bottomRef} aria-hidden="true" style={{ height: 1 }} />
      </section>

      <section className="active-chat-input">
        <BarChat onSend={handleSend} onStop={handleStop} isLoading={isLoading} active />
      </section>
    </main>
  )
}

export default ActiveChat