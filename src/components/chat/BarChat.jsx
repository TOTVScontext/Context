import { Plus, Send } from "@geist-ui/icons"

const BarChat = () => {

    const autoResize = (el) => {
        if (!el) return
        el.style.height = '0px'
        el.style.height = el.scrollHeight + 'px'
    }

    return (
        <main className="bar-chat-main">
            <textarea placeholder="Como posso ajudar você hoje?" rows={1} onInput={(e) => autoResize(e.target)} />
            <section className="bar-chat-btns">
                <button><Plus size={20} /></button>
                <div>
                    <p>NVIDIA nemotron-3</p>
                    <button><Send size={20} /></button>
                </div>
            </section>
        </main>
    )
}

export default BarChat
