import '../css/giveaway.css'
import logoContext from '../assets/img/totvs-context-l.png'
import { useState } from 'react'
import { CheckmarkFilled, WarningFilled, Gift, Email } from '@carbon/icons-react'
import { useGiveaway } from '../hooks/useGiveaway'

// ─── Constantes ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'giveaway_registered'

const GENDERS = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Feminino' },
    { value: 'non-binary', label: 'Não-binário' },
    { value: 'prefer not to say', label: 'Prefiro não dizer' },
]

const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG']

const INITIAL_FORM = { name: '', email: '', age: '', gender: '', size: '' }

// ─── Tela: já inscrito (volta ao abrir a página) ──────────────────────────────

function AlreadyRegistered() {
    return (
        <main className="giveaway-main">
            <section className="giveaway-content">
                <header className="giveaway-header">
                    <img src={logoContext} alt="TOTVScontext" draggable={false} />
                </header>

                <div className="giveaway-registered">
                    <CheckmarkFilled size={36} className="giveaway-registered-icon" />

                    <div className="giveaway-registered-body">
                        <h1>Você já está inscrito!</h1>
                        <p>Sua participação no sorteio foi confirmada. Acompanhe as informações abaixo.</p>
                    </div>

                    <div className="giveaway-registered-info">
                        <div className="giveaway-info-item">
                            <span className="giveaway-info-label">Resultado</span>
                            <span className="giveaway-info-value">Hoje às 18:00</span>
                        </div>
                        <div className="giveaway-info-divider" />
                        <div className="giveaway-info-item">
                            <Email size={14} className="giveaway-info-icon" />
                            <span className="giveaway-info-label">
                                O resultado do sorteio será enviado por e-mail. Aproveite o evento!
                            </span>
                        </div>
                    </div>
                </div>

                <footer className="giveaway-footer">
                    <p>TOTVS Context | {new Date().getFullYear()}</p>
                </footer>
            </section>
        </main>
    )
}

// ─── Tela: inscrição confirmada agora ─────────────────────────────────────────

function SuccessScreen() {
    return (
        <main className="giveaway-main">
            <section className="giveaway-content">
                <header className="giveaway-header">
                    <img src={logoContext} alt="TOTVScontext" draggable={false} />
                </header>

                <div className="giveaway-registered">
                    <CheckmarkFilled size={36} className="giveaway-registered-icon" />

                    <div className="giveaway-registered-body">
                        <h1>Inscrição confirmada!</h1>
                        <p>Sua participação no sorteio foi registrada com sucesso. Boa sorte!</p>
                    </div>

                    <div className="giveaway-registered-info">
                        <div className="giveaway-info-item">
                            <span className="giveaway-info-label">Resultado</span>
                            <span className="giveaway-info-value">Hoje às 18:00</span>
                        </div>
                        <div className="giveaway-info-divider" />
                        <div className="giveaway-info-item">
                            <Email size={14} className="giveaway-info-icon" />
                            <span className="giveaway-info-label">
                                O resultado do sorteio será enviado por e-mail. Aproveite o evento!
                            </span>
                        </div>
                    </div>
                </div>

                <footer className="giveaway-footer">
                    <p>TOTVS Context | {new Date().getFullYear()}</p>
                </footer>
            </section>
        </main>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────

const Giveaway = () => {
    const [form, setForm] = useState(INITIAL_FORM)
    const [alreadyRegistered] = useState(() => {
        try {
            return !!localStorage.getItem(STORAGE_KEY)
        } catch {
            return false
        }
    })
    const { submit, isLoading, isSuccess, isError, error } = useGiveaway()

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await submit({ ...form, age: Number(form.age) })
        if (result) {
            try {
                localStorage.setItem(STORAGE_KEY, '1')
            } catch {
                // silencioso — a tela de sucesso já foi exibida via isSuccess
            }
        }
    }

    if (alreadyRegistered) return <AlreadyRegistered />
    if (isSuccess) return <SuccessScreen />

    return (
        <main className="giveaway-main">
            <section className="giveaway-content">

                <header className="giveaway-header">
                    <img src={logoContext} alt="TOTVScontext" draggable={false} />
                </header>

                <article className="giveaway-card">
                    <div className="giveaway-card-top">
                        <Gift size={22} className="giveaway-card-icon" />
                        <div>
                            <h1>Sorteio</h1>
                            <p>Preencha os dados abaixo para participar do sorteio.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <section className="giveaway-fields">

                            <div className="giveaway-field">
                                <label htmlFor="name">Nome completo</label>
                                <div className="giveaway-input">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Seu nome"
                                        autoComplete="name"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="giveaway-field">
                                <label htmlFor="email">E-mail</label>
                                <div className="giveaway-input">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="exemplo@email.com"
                                        autoComplete="email"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="giveaway-field">
                                <label htmlFor="age">Idade</label>
                                <div className="giveaway-input">
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={form.age}
                                        onChange={handleChange}
                                        placeholder="Ex.: 25"
                                        min={1}
                                        max={120}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="giveaway-field">
                                <label htmlFor="gender">Gênero</label>
                                <div className="giveaway-input giveaway-input--select">
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled>Selecione</option>
                                        {GENDERS.map(g => (
                                            <option key={g.value} value={g.value}>{g.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="giveaway-field">
                                <label>Tamanho</label>
                                <div className="giveaway-sizes">
                                    {SIZES.map(s => (
                                        <label
                                            key={s}
                                            className={`giveaway-size ${form.size === s ? 'active' : ''} ${isLoading ? 'disabled' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="size"
                                                value={s}
                                                checked={form.size === s}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />
                                            {s}
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </section>

                        {isError && (
                            <div className="giveaway-error" role="alert">
                                <WarningFilled size={14} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="giveaway-submit">
                            <button type="submit" className="giveaway-btn" disabled={isLoading}>
                                {isLoading
                                    ? <><span className="dotLoad" />Enviando...</>
                                    : 'Participar'
                                }
                            </button>
                        </div>
                    </form>
                </article>

                <footer className="giveaway-footer">
                    <p>TOTVS Context | {new Date().getFullYear()}</p>
                </footer>

            </section>
        </main>
    )
}

export default Giveaway