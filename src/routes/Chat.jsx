import '../css/chat.css'
import Aside from "../components/Aside"
import Header from "../components/Header"
import { MessageSquare } from '@geist-ui/icons'

const Chat = () => {
    return (
        <main className="chat-main">
            <Header />
            <section className="content-main">
                <Aside />
                <section className="chat-content">
                    <section className='chat-active'>

                    </section>
                    <aside className='chat-chats'>
                        <header className='chat-chats-header'>
                            <h1>Meus Chats</h1>
                            <MessageSquare size={15} />
                        </header>
                        <section className='chat-chats-grid'>

                        </section>
                    </aside>
                </section>
            </section>
        </main>
    )
}

export default Chat
