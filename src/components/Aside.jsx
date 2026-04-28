import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useUser } from "../hooks/useUser";
import { logout } from '../services/auth'
import { Aperture, Archive, BarChart2, Calendar, Grid, HelpCircle, LogOut, Settings, Users } from "@geist-ui/icons"


const Aside = () => {

    const { user } = useUser();

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
            <section className="aside-nav">
                <nav>
                    <ul>
                        <NavLink to='/home'><Grid size={18} /></NavLink>
                        <NavLink to='/'><Archive size={18} /></NavLink>
                        <NavLink to='/'><BarChart2 size={18} /></NavLink>
                        <NavLink to='/'><Aperture size={18} /></NavLink>
                        <NavLink to='/'><Users size={18} /></NavLink>
                        <NavLink to='/'><Calendar size={18} /></NavLink>
                    </ul>
                </nav>
                <div>
                    <Link to=''><Settings size={18} /></Link>
                    <Link to=''><HelpCircle size={18} /></Link>
                </div>
            </section>
            <section className='aside-profile'>
                <button onClick={handleLogout}><LogOut size={18} /></button>
                <Link to='/profile'><img src={user?.profile?.photo} /></Link>
            </section>
        </aside>
    )
}

export default Aside
