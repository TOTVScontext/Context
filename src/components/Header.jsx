import { Link } from 'react-router-dom'
import { Bell, Code, HelpCircle, MessageCircle, Search, Sidebar, Terminal } from '@geist-ui/icons'

const Header = () => {
    const handleToggleAside = () => {
        const currentValue = localStorage.getItem('aside_open')

        const isOpen = currentValue !== 'false'

        localStorage.setItem('aside_open', (!isOpen).toString())

        window.dispatchEvent(new Event('aside-toggle'))
    }

    return (
        <header className="header-main">
            <section className="header-left">
                <button onClick={handleToggleAside}>
                    <Code size={14} />
                </button>

                <article className="header-search">
                    <button>
                        <Search size={17} />
                    </button>

                    <input type="text" placeholder="Pesquisar (ctrl + p)" />
                </article>
            </section>

            <section className="header-right">
                <Link to=''><HelpCircle size={15} />Ajuda</Link>

                <Link to='' className='active'>
                    <Terminal size={15} />
                    Context CLI
                </Link>
            </section>
        </header>
    )
}

export default Header