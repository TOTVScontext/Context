import '../css/chat.css'
import Aside from "../components/Aside"
import Header from "../components/Header"
import { MessageSquare } from '@geist-ui/icons'
import AsideChat from '../components/chat/AsideChat'
import { Outlet } from 'react-router-dom'

const Chat = () => {
    return (
        <main className="chat-main">
            <Header />
            <section className="content-main">
                <Aside />
                <section className="chat-content">
                    <section className='chat-active'>
                        <Outlet />
                    </section>
                    <AsideChat />
                </section>
            </section>
        </main>
    )
}

export default Chat
