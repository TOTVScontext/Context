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
                        <h1>Toda Conversa Conta. O Context Conecta <span>Comunicação </span>e<span> Resultado.</span></h1>
                        <p>O Context transforma conversas corporativas em métricas, insights e decisões inteligentes por meio de inteligência artificial avançada.</p>
                        <div>
                            <Link to='/login?view=login' className='active'><Chrome size={20} />Fazer LogIn</Link>
                            <Link><Download size={20} />Baixar Context CLI</Link>
                        </div>
                    </article>
                    <article className='welcome-presentation-right'>
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/analisis-de-grandes-datos-illustration-svg-download-png-3220037.png" />
                    </article>
                </section>
            </section>

        </main>
    )
}

export default Welcome
