import '../css/login.css'
import logoContextL from '../assets/svg/logo-context.svg'

const Login = () => {
    return (
        <main className="login-main">
            <section className='login-content-left'>
                <img src={logoContextL} />
                <p>Faça logon ou crie uma conta</p>
            </section>
        </main>
    )
}

export default Login
