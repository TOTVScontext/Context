import '../css/welcome.css'
import logo from '../assets/svg/logo-context.svg'
import { Link } from 'react-router-dom'

const Welcome = () => {
    return (
        <main className='welcome-main'>
            <header className='welcome-header'>
                <img src={logo} alt="TOTVS context" />
                <nav>
                    <ul>
                        <Link>Sobre</Link>
                        <Link>TOTVS</Link>
                        <Link>Planos</Link>
                        <Link>Suporte</Link>
                    </ul>
                </nav>
                <div>
                    <Link>Registrar</Link>
                    <Link className='active'>Entrar</Link>
                </div>
            </header>

        </main>
    )
}

export default Welcome
