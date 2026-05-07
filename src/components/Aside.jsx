import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { logout } from '../services/auth'
import logo from '../assets/svg/logo-context.svg'
import { Aperture, Archive, BookOpen, Calendar, Grid, Home, LogOut, Settings, TrendingUp } from "@geist-ui/icons"
import { useEffect, useState } from 'react'

const Aside = () => {
    const { user } = useUser()
    const navigate = useNavigate()

    const [collapsed, setCollapsed] = useState(() => {
        return localStorage.getItem('aside_open') === 'false'
    })

    useEffect(() => {
        const handleAsideToggle = () => {
            setCollapsed(localStorage.getItem('aside_open') === 'false')
        }

        window.addEventListener('aside-toggle', handleAsideToggle)

        return () => {
            window.removeEventListener('aside-toggle', handleAsideToggle)
        }
    }, [])

    const FirstName = () => {
        return user?.profile?.name?.trim().split(/\s+/).filter(Boolean)[0] || ''
    }

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
        <aside className={`aside-main ${collapsed ? 'collapsed' : ''}`}>
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
                            <NavLink to='/course'><BookOpen size={15} />Cursos</NavLink>
                            <NavLink to='/calendar'><Calendar size={15} />Agenda</NavLink>
                        </ul>
                    </nav>

                    <nav>
                        <ul>
                            <NavLink to='/chat'><Aperture size={15} />Context AI</NavLink>
                        </ul>
                    </nav>

                    <nav>
                        <ul>
                            <NavLink to='/integration'><Grid size={15} />Integrações</NavLink>
                            <NavLink to='/settings'><Settings size={15} />Configurações</NavLink>
                        </ul>
                    </nav>
                </div>

                <div className='aside-nav-profile'>
                    <Link to='/profile'>
                        <img src={user?.profile?.photo} alt={FirstName()} />

                        <div>
                            <h1>{FirstName()}</h1>
                            <h2>{user?.profile?.position}</h2>
                        </div>
                    </Link>

                    <button onClick={handleLogout}>
                        <LogOut size={15} />
                    </button>
                </div>
            </section>
        </aside>
    )
}

export default Aside