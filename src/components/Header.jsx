import { Link } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import icon from '../assets/img/icon-dark.png'
import { Bell, MessageCircle, Search } from '@geist-ui/icons';

const Header = () => {

    const { user } = useUser();

    return (
        <header className="header-main">
            <section className="header-content-left">
                <img src={icon} />
                <div>
                    <h1>Olá, {user?.profile?.name}!</h1>
                    <p>Explore informações e atividades sobre sua propriedade.</p>
                </div>
            </section>
            <section className="header-right">
                <div className='header-search'>
                    <input type="text" placeholder='Encontrar..' />
                    <button>
                        <Search size={19} />
                    </button>
                </div>
                <Link to='/message'><MessageCircle size={19} /></Link>
                <Link to='/notifications'><Bell size={19} /></Link>
            </section>
        </header>
    )
}

export default Header
