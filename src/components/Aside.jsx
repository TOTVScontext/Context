import { Link, NavLink } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import logo from '../assets/svg/logo-context.svg'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Box, Calendar, ChevronSort, Dashboard, Grid, Growth, Home, IbmKnowledgeCatalog, NewTab, Settings, ShapeExclude } from '@carbon/icons-react'
import ModalProfile from './ModalProfile'

const Aside = () => {
    const { user } = useUser()

    const [collapsed, setCollapsed] = useState(() => {
        return localStorage.getItem('aside_open') === 'false'
    })

    const [profileOpen, setProfileOpen] = useState(false)
    const profileTriggerRef = useRef(null)
    const modalRef = useRef(null)

    const closeAside = () => {
        localStorage.setItem('aside_open', 'false')
        window.dispatchEvent(new Event('aside-toggle'))
    }

    useEffect(() => {
        const handleAsideToggle = () => {
            setCollapsed(localStorage.getItem('aside_open') === 'false')
        }

        window.addEventListener('aside-toggle', handleAsideToggle)

        return () => {
            window.removeEventListener('aside-toggle', handleAsideToggle)
        }
    }, [])

    useEffect(() => {
        if (!profileOpen) return

        const handleClickOutside = (event) => {
            if (modalRef.current?.contains(event.target)) return
            if (profileTriggerRef.current?.contains(event.target)) return

            setProfileOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [profileOpen])

    const toggleProfile = useCallback(() => {
        setProfileOpen(prev => !prev)
    }, [])

    const closeProfile = useCallback(() => {
        setProfileOpen(false)
    }, [])

    const FullName = () => {
        const names = user?.name?.trim().split(/\s+/).filter(Boolean) || []

        if (names.length <= 1) return names[0] || ''

        return `${names[0]} ${names[names.length - 1]}`
    }

    return (
        <aside className={`aside-main ${collapsed ? 'collapsed' : ''}`}>
            <header className='aside-header'>
                <Link to='/home'>
                    <img draggable={false} src={logo} alt="TOTVScontext" />
                </Link>
            </header>

            <section className='aside-nav'>
                <div className='aside-nav-scrool'>
                    <nav>
                        <ul>
                            <NavLink to='/home' title='Início'><Home size={16} /><span>Início</span></NavLink>
                            <NavLink to='/new' title='Nova análise'><NewTab size={16} /><span>Nova análise</span></NavLink>
                            <NavLink to='/deshboard' title='Painel geral'><Dashboard size={16} /><span>Painel geral</span></NavLink>
                            <NavLink to='/analysis' title='Análises'><Box size={16} /><span>Análises</span></NavLink>
                            <NavLink to='/courses' title='Cursos'><IbmKnowledgeCatalog size={16} /><span>Cursos</span></NavLink>
                            <NavLink to='/calendar' title='Agenda'><Calendar size={16} /><span>Agenda</span></NavLink>
                        </ul>
                    </nav>

                    <nav>
                        <ul>
                            <NavLink to='/chat' onClick={closeAside} title='Context AI'><ShapeExclude size={15} /><span>Context AI</span></NavLink>
                        </ul>
                    </nav>

                    <nav>
                        <ul>
                            <NavLink to='/integration' title='Integrações'><Grid size={15} /><span>Integrações</span></NavLink>
                            <NavLink to='/settings' title='Configurações'><Settings size={15} /><span>Configurações</span></NavLink>
                        </ul>
                    </nav>
                </div>

                <div ref={profileTriggerRef} className={`aside-nav-profile ${profileOpen ? 'active' : ''}`} onClick={toggleProfile}>
                    <section>
                        <img draggable={false} src={user?.photo} />

                        <div>
                            <h1>{FullName()}</h1>
                            <h2>{user?.plan}</h2>
                        </div>
                    </section>
                    <button>
                        <ChevronSort size={14} />
                    </button>
                </div>
            </section>
            <ModalProfile ref={modalRef} isOpen={profileOpen} onClose={closeProfile} />
        </aside>
    )
}

export default Aside