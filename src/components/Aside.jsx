import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { logout } from '../services/auth'
import logo from '../assets/svg/logo-context.svg'
import { Aperture, Archive, BarChart2, Calendar, Code, Grid, HelpCircle, Home, LogOut, Settings, Sidebar, TrendingUp, Users } from "@geist-ui/icons"


const Aside = () => {

    const { user } = useUser();

    const FirstName = () => {
        return user?.profile?.name
            .trim()
            .split(/\s+/)
            .filter(Boolean)[0] || '';
    }

    const navigate = useNavigate()

    const handleLogout = async (e) => {
        e.preventDefault()

        try {
            await logout()
            window.location.reload()
            navigate('/login', { replace: true })
        } catch (err) {
            console.error('Logout failed', err)
        }
    }

    return (
        <aside className="aside-main">
            <header className='aside-header'>
                <img src={logo} alt="TOTVScontext" />
            </header>
            <section className='aside-nav'>
                <div className='aside-nav-scrool'>
                    <nav>
                        <ul>
                            <NavLink to='/home'><Home size={15} />Home</NavLink>
                            <NavLink to='/analysis'><Archive size={15} />Análises</NavLink>
                            <NavLink to='/deshboard'><TrendingUp size={15} />Painel geral</NavLink>
                        </ul>
                    </nav>
                    <nav>
                        <ul>
                            <NavLink to='/chat'><Aperture size={15} />Context AI</NavLink>
                        </ul>
                    </nav>
                    <nav>
                        <ul>
                            <NavLink to='/chat'><Settings size={15} />Configurações</NavLink>
                        </ul>
                    </nav>
                </div>
                <div className='aside-nav-profile'>
                    <Link to=''>
                        <img src={user?.profile?.photo} />
                        <div>
                            <h1>{FirstName()}</h1>
                            <h2>{user?.profile?.position}</h2>
                        </div>
                    </Link>
                    <button onClick={handleLogout}><LogOut size={16} /></button>
                </div>
            </section>
        </aside>
    )
}

export default Aside
