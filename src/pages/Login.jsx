import '../css/login.css'
import logoContextL from '../assets/svg/logo-context.svg'
import iconD from '../assets/img/icon-dark.png'
import { Link } from 'react-router-dom'
import { Eye } from '@geist-ui/icons'

const Login = () => {
    return (
        <main className="login-main">
            <section className='login-content'>
                <article className='login-content-left'>
                    <img src={logoContextL} />
                    <p>Faça logon ou crie uma conta</p>
                </article>

                <article className='login-content-right'>
                    <section className='wrapper-login'>
                        <h1>Criar uma conta</h1>
                        <section className='wrapper-login-ways'>
                            <button><img title='Google' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" /></button>
                            <button><img title='TOTVS' src={iconD} /></button>
                            <button><img title='Facebook' src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Facebook_Logo_2023.png/960px-Facebook_Logo_2023.png" /></button>
                            <button><img title='Apple' src="https://cdn-icons-png.flaticon.com/256/25/25345.png" /></button>
                            <button><img title='Microsoft' src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/960px-Microsoft_logo.svg.png" /></button>
                            <button><img title='GitHub' src="https://cdn-icons-png.flaticon.com/512/25/25231.png" /></button>
                        </section>

                        <div className='wrapper-login-or'>
                            <hr />
                            Ou
                            <hr />
                        </div>

                        <h2>Inscrever-se com email</h2>

                        <h3>Ja tem uma conta TOTVScontext? <Link>Faça logon</Link></h3>

                        <section className='wrapper-login-input'>
                            <label htmlFor="email">Endereço de email</label>
                            <div className='input-login'>
                                <input type="email" id='email' />
                            </div>

                            <label htmlFor="password">Senha</label>
                            <div className='input-login'>
                                <input type="password" id='password' />
                                <button><Eye size={16} /></button>
                            </div>
                        </section>

                        <div className='wrapper-login-submit'>
                            <button>Continuar</button>
                        </div>
                    </section>
                </article>
            </section>
        </main>
    )
}

export default Login
