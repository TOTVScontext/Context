import '../css/welcome.css'
import logo from '../assets/svg/logo-context.svg'
import { Link } from 'react-router-dom'
import { Chrome, Download } from '@geist-ui/icons'

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

            <section className='welcome-content'>
                <section className='welcome-presentation'>
                    <article className='welcome-presentation-left'>
                        <h1>Plataforma de inteligência conversacional para performance corporativa</h1>
                        <p>O Context é uma plataforma de inteligência conversacional que transforma reuniões, chamadas e interações corporativas em métricas estruturadas, feedbacks acionáveis e inteligência estratégica de alta precisão.</p>
                        <div>
                            <Link className='active'><Chrome size={20} />Fazer LogIn</Link>
                            <Link><Download size={20} />Baixar Context CLI</Link>
                        </div>
                    </article>
                    <article className='welcome-presentation-right'>
                    </article>
                </section>
            </section>

        </main>
    )
}

export default Welcome
