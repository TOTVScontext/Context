import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { logout } from '../services/auth'
import logo from '../assets/svg/logo-context.svg'
import { useEffect, useState } from 'react'
import { AiAgentInvocation, Aperture, Box, Calendar, Grid, Growth, Home, IbmKnowledgeCatalog, Logout, Settings } from '@carbon/icons-react'

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
                <Link to='/home'>
                    <img src={logo} alt="TOTVScontext" />
                </Link>
            </header>

            <section className='aside-nav'>
                <div className='aside-nav-scrool'>
                    <nav>
                        <ul>
                            <NavLink to='/home' title='Início'><Home size={16} /><span>Início</span></NavLink>
                            <NavLink to='/analysis' title='Análises'><Box size={16} /><span>Análises</span></NavLink>
                            <NavLink to='/deshboard' title='Painel geral'><Growth size={16} /><span>Painel geral</span></NavLink>
                            <NavLink to='/course' title='Cursos'><IbmKnowledgeCatalog size={16} /><span>Cursos</span></NavLink>
                            <NavLink to='/calendar' title='Agenda'><Calendar size={16} /><span>Agenda</span></NavLink>
                        </ul>
                    </nav>

                    <nav>
                        <ul>
                            <NavLink to='/chat' title='Context AI'><AiAgentInvocation size={15} /><span>Context AI</span></NavLink>
                        </ul>
                    </nav>

                    <nav>
                        <ul>
                            <NavLink to='/integration' title='Integrações'><Grid size={15} /><span>Integrações</span></NavLink>
                            <NavLink to='/settings' title='Configurações'><Settings size={15} /><span>Configurações</span></NavLink>
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
                        <Logout size={15} />
                    </button>
                </div>
            </section>
        </aside>
    )
}

export default Aside