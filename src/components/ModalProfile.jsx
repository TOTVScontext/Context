import { Blog, Help, Logout, Settings } from "@carbon/icons-react"
import { useUser } from "../hooks/useUser"
import { logout } from "../services/auth"
import { useNavigate } from "react-router-dom"
import { forwardRef } from 'react'

const ModalProfile = forwardRef(({ isOpen, onClose }, ref) => {
    
    const { user } = useUser()
    
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

    if (!isOpen) return null
    
    return (
        <article ref={ref} className='modal-profile'>
            <p>{user?.email}</p>
            <hr />
            <button onClick={() => window.location.href = '/welcome'}><Blog />Welcome</button>
            <button onClick={() => {window.location.href = '/settings', onClose()}}><Settings size={16} />Configurações</button>
            <button onClick={() => {window.location.href = '/settings/help', onClose()}}><Help />Ajuda</button>
            <hr />
            <button onClick={handleLogout}><Logout size={16} />LogOut</button>
        </article>
    )
})

export default ModalProfile
