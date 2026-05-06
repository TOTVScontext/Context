import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../../hooks/useChat'
import { useUser } from '../../hooks/useUser'
import { Aperture } from '@geist-ui/icons'
import BarChat from './BarChat'

const NewChat = () => {
    const navigate = useNavigate()
    const { user } = useUser()

    const getFirstName = () => {
        return (user?.profile?.name || '')
            .trim()
            .split(/\s+/)
            .filter(Boolean)[0] || '';
    }

    function getLastName() {
        const partes = (user?.profile?.name || '')
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        return partes.length > 1 ? partes[partes.length - 1] : '';
    }

    const {
        isLoading,
        sendMessage,
        stop,
        reset
    } = useChat()

    useEffect(() => {
        reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const handler = (e) => {
            const newId = e.detail
            if (newId) {
                navigate(`/chat/${newId}`, { replace: true })
            }
        }

        window.addEventListener('chat:created', handler)
        return () => window.removeEventListener('chat:created', handler)
    }, [navigate])


    const handleSend = useCallback((payload) => {
        sendMessage(payload)
    }, [sendMessage])

    const handleStop = useCallback(() => {
        stop()
    }, [stop])

    return (
        <main className="new-chat-main">

            <section className="new-chat-welcome">
                <Aperture size={34} className="rgb-color" />
                <h1>Olá, {getFirstName()} {getLastName()}</h1>
            </section>

            <section className="new-chat-input">
                <BarChat
                    onSend={handleSend}
                    onStop={handleStop}
                    isLoading={isLoading}
                />
            </section>

        </main>
    )
}

export default NewChat