import { Link } from 'react-router-dom'
import '../css/error.css'
import logo from '../assets/img/icon-dark.png'
import { useAuth } from '../hooks/useAuth'

const Error = () => {

    const { isAuthenticated } = useAuth()

    return (
        <main className='error-main'>
            <img src={logo} draggable={false} />
            <h1>Página não encontrada</h1>
            <p>Esta página não existe ou não está mais disponível.<br />Verifique o endereço ou volte ao início para continuar.</p>
            <Link to={isAuthenticated ? '/home' : '/welcome'}>Voltar para a página inicial</Link>
        </main>
    )
}

export default Error
