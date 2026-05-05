import { Link } from 'react-router-dom'
import { Bell, Code, HelpCircle, MessageCircle, Search, Sidebar, Terminal } from '@geist-ui/icons';

const Header = () => {
    return (
        <header className="header-main">
            <section className='header-left'>
                <button><Code size={14} /></button>

                <article className='header-search'>
                    <button><Search size={17} /></button>
                    <input type="text" placeholder='Pesquisar (ctrl + p)' />
                </article>
            </section>
            <section className='header-right'>
                <Link to=''><HelpCircle size={15} />Ajuda</Link>
                <Link className='active' to='https://github.com/TOTVScontext/Context-CLI/archive/refs/heads/main.zip'><Terminal size={15} />Context CLI</Link>
            </section>
        </header>
    )
}

export default Header
