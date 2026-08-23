import '../css/login.css'
import logoContextL from '../assets/svg/logo-context.svg'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from '@geist-ui/icons'
import { useUser } from '../hooks/useUser'
import { useState, useEffect } from 'react'
import { login, register } from '../services/auth'

const Login = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const view = searchParams.get('view')
    const isRegister = view === 'register'

    const [showPass, setShowPass] = useState(false)
    const { user } = useUser()
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (user) navigate('/home', { replace: true })
    }, [user, navigate])

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (!isRegister) {
                await login(form.email, form.password)
                window.location.href = '/home'
            } else {
                await register(form.name, form.email, form.password)
                navigate('?view=login', { replace: true })
            }
            localStorage.setItem("first_login", 'false')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="login-main">
            <section className='login-content'>

                <article className='login-content-left'>
                    <img src={logoContextL} alt="TOTVScontext" />
                    <p>Faça login ou crie uma conta</p>
                </article>

                <article className='login-content-right'>
                    <section className='wrapper-login'>
                        <h1>{isRegister ? 'Criar uma conta' : 'Bem-vindo de volta'}</h1>

                        <section className='wrapper-login-google'>
                            <button><img title='Google' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" />Continuar com Google</button>
                        </section>

                        <div className='wrapper-login-or'>
                            <hr />ou<hr />
                        </div>

                        <h2>{isRegister ? 'Inscrever-se com email' : 'Entrar com email'}</h2>

                        <form onSubmit={handleSubmit} noValidate>
                            <section className='wrapper-login-input'>
                                {isRegister && (
                                    <>
                                        <label htmlFor="name">Nome</label>
                                        <div className='input-login'>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                autoComplete="name"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </>
                                )}

                                <label htmlFor="email">Endereço de email</label>
                                <div className='input-login'>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                        disabled={loading}
                                        placeholder='exemplo.totvs@gmail.com'
                                    />
                                </div>

                                <label htmlFor="password">Senha</label>
                                <div className='input-login'>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(p => !p)}
                                        aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                                    >
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </section>

                            {error && (
                                <p className='login-error' role="alert">{error}</p>
                            )}

                            <h3>
                                {isRegister
                                    ? <>Já tem uma conta? <Link to="?view=login">Faça login</Link></>
                                    : <>Não tem uma conta? <Link to="?view=register">Criar conta</Link></>
                                }
                            </h3>

                            <div className='wrapper-login-submit'>
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Aguarde...' : 'Continuar'}
                                </button>
                            </div>
                        </form>

                    </section>
                </article>
            </section>
        </main>
    )
}

export default Login