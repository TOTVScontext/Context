import { Edit, MessageSquare, Plus, Trash2 } from "@geist-ui/icons"

const AsideChat = () => {
    return (
        <aside className='chat-aside'>
            <header className='chat-aside-header'>
                <div>
                    <h1>Meus Chats</h1>
                    <MessageSquare size={15} />
                </div>
                <div>
                    <button><Plus size={16} /></button>
                </div>
            </header>
            <section className='chat-aside-grid'>
                <div className="chat-card">
                    <h1>Nova conversa</h1>
                    <section className="chat-card-info">
                        <button><Trash2 size={16} /></button>
                        <button><Edit size={16} /></button>
                    </section>
                </div>
                <div className="chat-card active">
                    <h1>Testando novo chat</h1>
                    <section className="chat-card-info">
                        <button><Trash2 size={16} /></button>
                        <button><Edit size={16} /></button>
                    </section>
                </div>

            </section>
        </aside>
    )
}

export default AsideChat
