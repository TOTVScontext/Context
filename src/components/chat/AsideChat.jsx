import { useEffect, useState, useCallback } from 'react'
import { Check, Edit, MessageSquare, Plus, Trash2, X } from '@geist-ui/icons'
import { ChatService } from '../../services/chatService'
import { Link, useNavigate, useParams } from 'react-router-dom'

const AsideChat = () => {
  const navigate = useNavigate()
  const { id: activeIdFromRoute } = useParams()

  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(false)

  const [editingChatId, setEditingChatId] = useState(null)
  const [editingValue, setEditingValue] = useState('')
  const [deletingChatId, setDeletingChatId] = useState(null)

  const reloadChats = useCallback(async () => {
    try {
      setLoading(true)

      const data = await ChatService.list()

      const list =
        data?.chats ??
        data?.data ??
        (Array.isArray(data) ? data : [])

      setChats(list)
    } catch (err) {
      console.error('[AsideChat] erro ao listar:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        setLoading(true)

        const data = await ChatService.list()

        if (!mounted) return

        const list =
          data?.chats ??
          data?.data ??
          (Array.isArray(data) ? data : [])

        setChats(list)
      } catch (err) {
        console.error('[AsideChat] erro ao listar:', err)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const handler = () => reloadChats()

    window.addEventListener('chat:created', handler)
    return () => window.removeEventListener('chat:created', handler)
  }, [reloadChats])

  const handleNewChat = () => {
    navigate('/chat/new')
  }

  const startDeleting = (id) => {
    setDeletingChatId(id)
    setEditingChatId(null)
  }

  const cancelDeleting = () => setDeletingChatId(null)

  const confirmDelete = async (id) => {
    try {
      await ChatService.delete(id)

      setChats(prev => prev.filter(chat => chat.id !== id))

      if (id === activeIdFromRoute) {
        navigate('/chat/new', { replace: true })
      }
    } catch (err) {
      console.error('[AsideChat] erro ao deletar:', err)
    } finally {
      setDeletingChatId(null)
    }
  }

  const startEditing = (chat) => {
    setEditingChatId(chat.id)
    setEditingValue(chat.title ?? '')
    setDeletingChatId(null)
  }

  const cancelEditing = () => {
    setEditingChatId(null)
    setEditingValue('')
  }

  const confirmEditing = async (id) => {
    const newTitle = editingValue.trim()

    cancelEditing()

    if (!newTitle) return

    try {
      await ChatService.updateTitle(id, newTitle)

      setChats(prev =>
        prev.map(chat =>
          chat.id === id ? { ...chat, title: newTitle } : chat
        )
      )
    } catch (err) {
      console.error('[AsideChat] erro ao renomear:', err)
    }
  }

  return (
    <aside className="chat-aside">
      <header className="chat-aside-header">
        <div>
          <h1>Meus Chats</h1>
          <MessageSquare size={15} />
        </div>

        <button onClick={handleNewChat} title="Novo chat">
          <Plus size={16} />
        </button>
      </header>

      <section className="chat-aside-grid">
        {loading && <p className="chat-aside-loading">Carregando...</p>}

        {!loading && chats.length === 0 && (
          <p className="chat-nochats">Nenhum chat ainda</p>
        )}

        {chats.map(chat => {
          const isActive = chat.id === activeIdFromRoute
          const isEditing = chat.id === editingChatId
          const isDeleting = chat.id === deletingChatId

          return (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
              className={`chat-card ${isActive ? 'active' : ''}`}
              onClick={(e) => {
                if (isEditing || isDeleting) e.preventDefault()
              }}
            >
              {isEditing ? (
                <input
                  autoFocus
                  maxLength={27}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => confirmEditing(chat.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmEditing(chat.id)
                    if (e.key === 'Escape') cancelEditing()
                  }}
                />
              ) : (
                <h1>{chat.title || 'Novo chat'}</h1>
              )}

              <section className='chat-card-info' onClick={(e) => e.preventDefault()}>
                {isEditing ? (
                  <>
                    <button onClick={cancelEditing}>
                      <X size={16} />
                    </button>
                    <button onClick={() => confirmEditing(chat.id)}>
                      <Check size={16} />
                    </button>
                  </>
                ) : isDeleting ? (
                  <>
                    <button onClick={cancelDeleting}>
                      <X size={16} />
                    </button>
                    <button onClick={() => confirmDelete(chat.id)}>
                      <Check size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startDeleting(chat.id)}>
                      <Trash2 size={16} />
                    </button>
                    <button onClick={() => startEditing(chat)}>
                      <Edit size={16} />
                    </button>
                  </>
                )}
              </section>
            </Link>
          )
        })}
      </section>
    </aside>
  )
}

export default AsideChat