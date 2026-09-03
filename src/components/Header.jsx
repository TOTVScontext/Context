import { Link } from 'react-router-dom'
import { ChevronSort, Help, Search, Terminal } from '@carbon/icons-react'

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
                    <ChevronSort className='icon' size={16} />
                </button>

                <article className="header-search">
                    <button>
                        <Search size={15} />
                    </button>

                    <input type="text" placeholder="Pesquisar (ctrl + p)" />
                </article>
            </section>

            <section className="header-right">
                <Link to=''><Help size={15} />Ajuda</Link>

                <Link to='/cli' className='active'>
                    <Terminal size={15} />
                    Context CLI
                </Link>
            </section>
        </header>
    )
}

export default Header