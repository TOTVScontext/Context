import '../css/welcome.css'
import logo from '../assets/svg/logo-context.svg'
import { Link } from 'react-router-dom'

const Welcome = () => {
    return (
        <main className='welcome-main'>
            <header className='welcome-header'>
                <img onClick={() => window.location.reload()} src={logo} alt="TOTVS context" />
                <nav>
                    <ul>
                        <Link to='#about'>Sobre</Link>
                        <Link to='#totvs'>TOTVS</Link>
                        <Link to='#plans'>Planos</Link>
                        <Link to='#support'>Suporte</Link>
                    </ul>
                </nav>
                <div>
                    <Link to='/login?view=register'>Registrar</Link>
                    <Link to='/login?view=login' className='active'>Entrar</Link>
                </div>
            </header>

        </main>
    )
}

export default Welcome
