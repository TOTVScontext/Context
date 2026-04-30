import { useEffect, useState, useCallback } from 'react'
import { Check, Edit, MessageSquare, Plus, Trash2, X } from "@geist-ui/icons"
import { ChatService } from '../../services/chatService'

const STORAGE_KEY = 'active_chat_id'

const AsideChat = () => {
    const [chats, setChats] = useState([])
    const [activeChatId, setActiveChatId] = useState(() => {
        return localStorage.getItem(STORAGE_KEY)
    })
    const [loading, setLoading] = useState(false)

    const [editingChatId, setEditingChatId] = useState(null)
    const [editingValue, setEditingValue] = useState('')

    const [deletingChatId, setDeletingChatId] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                setLoading(true)

                const data = await ChatService.list()

                if (!cancelled) {
                    setChats(data.chats || [])
                }
            } catch (err) {
                console.error(err)
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        load()

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        if (activeChatId) {
            localStorage.setItem(STORAGE_KEY, activeChatId)
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [activeChatId])

    const handleSelect = useCallback((chatId) => {
        setActiveChatId(chatId)
        window.dispatchEvent(new CustomEvent('chat:selected', { detail: chatId }))
    }, [])


    const startDeleting = (chatId) => {
        setDeletingChatId(chatId)
        setEditingChatId(null)
    }

    const cancelDeleting = () => {
        setDeletingChatId(null)
    }

    const confirmDelete = async (chatId) => {
        try {
            await ChatService.delete(chatId)

            setChats(prev => prev.filter(c => c.id !== chatId))

            if (chatId === activeChatId) {
                setActiveChatId(null)
            }
        } catch (err) {
            console.error('[AsideChat] erro ao deletar:', err)
        } finally {
            setDeletingChatId(null)
        }
    }


    const startEditing = (chat) => {
        setEditingChatId(chat.id)
        setEditingValue(chat.title || '')
        setDeletingChatId(null)
    }

    const cancelEditing = () => {
        setEditingChatId(null)
        setEditingValue('')
    }

    const confirmEditing = async (chatId) => {
        const newTitle = editingValue.trim()

        if (!newTitle) {
            cancelEditing()
            return
        }

        try {
            await ChatService.updateTitle(chatId, newTitle)

            setChats(prev =>
                prev.map(c =>
                    c.id === chatId ? { ...c, title: newTitle } : c
                )
            )
        } catch (err) {
            console.error('[AsideChat] erro ao renomear:', err)
        } finally {
            cancelEditing()
        }
    }

    const handleNewChat = useCallback(() => {
        setActiveChatId(null)
        window.dispatchEvent(new CustomEvent('chat:new'))
    }, [])

    return (
        <aside className='chat-aside'>
            <header className='chat-aside-header'>
                <div>
                    <h1>Meus Chats</h1>
                    <MessageSquare size={15} />
                </div>

                <button onClick={handleNewChat}>
                    <Plus size={16} />
                </button>
            </header>

            <section className='chat-aside-grid'>
                {loading && <p className='chat-aside-loading'>Carregando...</p>}

                {!loading && chats.length === 0 && (
                    <p className='chat-nochats'>Nenhum chat ainda</p>
                )}

                {chats.map(chat => {
                    const isActive = chat.id === activeChatId
                    const isEditing = chat.id === editingChatId
                    const isDeleting = chat.id === deletingChatId

                    return (
                        <div
                            key={chat.id}
                            className={`chat-card ${isActive ? 'active' : ''}`}
                            onClick={() => {
                                if (!isEditing && !isDeleting) {
                                    handleSelect(chat.id)
                                }
                            }}
                        >
                            {isEditing ? (
                                <input
                                    autoFocus
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

                            <section
                                className="chat-card-info"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {isEditing ? (
                                    <>
                                        <button onClick={cancelEditing} title="Cancelar">
                                            <X size={16} />
                                        </button>

                                        <button onClick={() => confirmEditing(chat.id)} title="Confirmar">
                                            <Check size={16} />
                                        </button>
                                    </>
                                ) : isDeleting ? (
                                    <>
                                        <button onClick={cancelDeleting} title="Cancelar">
                                            <X size={16} />
                                        </button>

                                        <button onClick={() => confirmDelete(chat.id)} title="Confirmar">
                                            <Check size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startDeleting(chat.id)} title="Deletar">
                                            <Trash2 size={16} />
                                        </button>

                                        <button onClick={() => startEditing(chat)} title="Editar">
                                            <Edit size={16} />
                                        </button>
                                    </>
                                )}
                            </section>
                        </div>
                    )
                })}
            </section>
        </aside>
    )
}

export default AsideChat