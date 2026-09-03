import '../css/cli.css'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Copy, Checkmark, Download, ChevronDown, ArrowRight, Terminal } from '@carbon/icons-react'
import logo from '../assets/svg/logo-context-cli.svg'

const installCommands = {
    macos: 'curl -fsSL https://github.com/TOTVScontext/Context-CLI/archive/refs/heads/main.zip -o Context-CLI.zip',
    linux: 'curl -fsSL https://github.com/TOTVScontext/Context-CLI/archive/refs/heads/main.zip -o Context-CLI.zip',
    windows: 'iwr "https://github.com/TOTVScontext/Context-CLI/archive/refs/heads/main.zip" -OutFile "Context-CLI.zip"',
}

const verifyCommands = {
    macos: 'context --version',
    linux: 'context --version',
    windows: 'context --version',
}

const commandReference = [
    { cmd: 'context login', desc: 'Autentica a sessão local com sua conta TOTVS Context.' },
    { cmd: 'context analyze <arquivo>', desc: 'Envia uma transcrição para análise de sentimento e engajamento.' },
    { cmd: 'context report --export pdf|json', desc: 'Exporta o relatório da última análise no formato escolhido.' },
    { cmd: 'context history', desc: 'Lista as análises realizadas nos últimos 30 dias.' },
    { cmd: 'context watch <pasta>', desc: 'Monitora uma pasta e analisa novas transcrições automaticamente.' },
    { cmd: 'context config set <chave>', desc: 'Define preferências locais, como workspace padrão e idioma.' },
    { cmd: 'context --help', desc: 'Lista todos os comandos disponíveis e suas opções.' },
]

const features = [
    { title: 'Integração com pipelines', desc: 'Rode análises como etapa de CI/CD ou em scripts internos, sem interface gráfica envolvida.' },
    { title: 'Saída estruturada', desc: 'Resultados em JSON, PDF ou texto simples, prontos para consumir em outras ferramentas e dashboards.' },
    { title: 'Multiplataforma', desc: 'Um único binário para macOS, Linux e Windows, com atualização automática via CLI.' },
    { title: 'Monitoramento de pastas', desc: 'Aponte o CLI para uma pasta e novas transcrições são analisadas assim que chegam.' },
    { title: 'Autenticação segura', desc: 'Login via token de sessão, sem expor credenciais em texto plano nos seus scripts.' },
    { title: 'Configuração por workspace', desc: 'Alterne entre times e projetos diferentes sem reinstalar ou reconfigurar nada.' },
]

const faqs = [
    { q: 'O Context CLI substitui o painel web?', a: 'Não. O CLI é um complemento para times técnicos e fluxos automatizados. O painel web continua sendo o lugar para visão gerencial e comparativos entre períodos.' },
    { q: 'Preciso de uma licença Pro para usar o CLI?', a: 'O CLI funciona com qualquer plano, incluindo o Starter. O limite de análises mensais segue o mesmo do seu plano ativo.' },
    { q: 'O CLI funciona offline?', a: 'A autenticação e o processamento de análise dependem de conexão com os servidores do Context. O CLI apenas envia e recebe dados, sem processamento local do modelo.' },
    { q: 'Como faço para atualizar o CLI?', a: 'Rode "context update" a qualquer momento. O CLI também avisa automaticamente quando uma nova versão está disponível.' },
]

const Cli = () => {

    const navigate = useNavigate();
    const [os, setOs] = useState('linux');
    const [copiedInstall, setCopiedInstall] = useState(false);
    const [copiedVerify, setCopiedVerify] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const handleCopyInstall = () => {
        navigator.clipboard.writeText(installCommands[os]);
        setCopiedInstall(true);
        setTimeout(() => setCopiedInstall(false), 2000);
    }

    const handleCopyVerify = () => {
        navigator.clipboard.writeText(verifyCommands[os]);
        setCopiedVerify(true);
        setTimeout(() => setCopiedVerify(false), 2000);
    }

    const toggleFaq = (i) => {
        setOpenFaq(openFaq === i ? null : i);
    }

    return (
        <main className="cli-main">
            <header className='cli-header'>
                <p onClick={() => navigate(-1)}><ChevronLeft size={16} />Voltar</p>
                <Link to=''>
                    <img src={logo} alt="TOTVS context" />
                </Link>
                <span></span>
            </header>

            <section className='cli-content'>

                <section className='cli-hero'>
                    <h1>Análise de conversas, direto no seu terminal.</h1>
                    <p>Instale o Context CLI e envie transcrições, integre pipelines e receba insights de sentimento e engajamento sem sair da linha de comando.</p>
                </section>

                <section className='cli-install'>
                    <div className='cli-install-tabs' role='tablist'>
                        <button role='tab' aria-selected={os === 'macos'} className={os === 'macos' ? 'active' : ''} onClick={() => setOs('macos')}>macOS</button>
                        <button role='tab' aria-selected={os === 'linux'} className={os === 'linux' ? 'active' : ''} onClick={() => setOs('linux')}>Linux</button>
                        <button role='tab' aria-selected={os === 'windows'} className={os === 'windows' ? 'active' : ''} onClick={() => setOs('windows')}>Windows</button>
                    </div>

                    <div className='cli-snippet'>
                        <div className='cli-snippet-bar'>
                            <span className='cli-snippet-label'>Instalação</span>
                        </div>
                        <div className='cli-snippet-body'>
                            <span className='prompt'>$</span>
                            <code className='cmd'>{installCommands[os]}</code>
                            <button className='cli-snippet-copy' onClick={handleCopyInstall} aria-label='Copiar comando'>
                                {copiedInstall ? <Checkmark size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>

                    <div className='cli-snippet cli-snippet-secondary'>
                        <div className='cli-snippet-bar'>
                            <span className='cli-snippet-label'>Verificar instalação</span>
                        </div>
                        <div className='cli-snippet-body'>
                            <span className='prompt'>$</span>
                            <code className='cmd'>{verifyCommands[os]}</code>
                            <button className='cli-snippet-copy' onClick={handleCopyVerify} aria-label='Copiar comando'>
                                {copiedVerify ? <Checkmark size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>

                    <p className='cli-install-note'>Requer Node.js 18+ ou o binário standalone. Nenhuma dependência externa é instalada no seu sistema.</p>
                </section>

                <section className='cli-quickstart'>
                    <span className='cli-eyebrow'>Primeiros passos</span>
                    <h2>De instalado a insight em menos de um minuto.</h2>
                    <div className='cli-quickstart-grid'>
                        {[
                            { n: '01', cmd: 'context login', desc: 'Autentique sua conta TOTVS Context com um único comando.' },
                            { n: '02', cmd: 'context analyze ./reuniao.txt', desc: 'Envie a transcrição de uma reunião ou chamada para análise.' },
                            { n: '03', cmd: 'context report --export pdf', desc: 'Exporte o relatório com sentimento, engajamento e destaques.' },
                        ].map((s) => (
                            <div className='cli-quickstart-card' key={s.n}>
                                <span className='cli-quickstart-card-n'>{s.n}</span>
                                <code>{s.cmd}</code>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='cli-reference'>
                    <span className='cli-eyebrow'>Referência</span>
                    <h2>Comandos mais usados</h2>
                    <div className='cli-reference-table'>
                        <div className='cli-reference-row cli-reference-head'>
                            <span>Comando</span>
                            <span>Descrição</span>
                        </div>
                        {commandReference.map((r) => (
                            <div className='cli-reference-row' key={r.cmd}>
                                <code>{r.cmd}</code>
                                <span>{r.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='cli-features'>
                    <span className='cli-eyebrow'>Recursos</span>
                    <h2>Feito para times técnicos e operações automatizadas.</h2>
                    <div className='cli-features-grid'>
                        {features.map((f) => (
                            <div className='cli-features-card' key={f.title}>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='cli-compare'>
                    <div className='cli-compare-inner'>
                        <article className='cli-compare-left'>
                            <span className='cli-eyebrow'>CLI ou painel web?</span>
                            <h2>Use o que faz sentido para cada fluxo.</h2>
                            <p>O CLI não substitui o painel — ele estende o Context para onde o painel não chega: scripts, pipelines e automações.</p>
                        </article>
                        <div className='cli-compare-right'>
                            <div className='cli-compare-col'>
                                <h4>Painel web</h4>
                                <span>Visão gerencial e comparativos por período</span>
                                <span>Times que decidem sem escrever código</span>
                                <span>Relatórios visuais para stakeholders</span>
                            </div>
                            <div className='cli-compare-col cli-compare-col-active'>
                                <h4>Context CLI</h4>
                                <span>Automação via scripts e pipelines de CI/CD</span>
                                <span>Monitoramento contínuo de pastas e integrações</span>
                                <span>Saída estruturada para consumo por outras ferramentas</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='cli-faq'>
                    <span className='cli-eyebrow'>Dúvidas frequentes</span>
                    <h2>Perguntas sobre o CLI</h2>
                    <div className='cli-faq-list'>
                        {faqs.map((f, i) => (
                            <div className={`cli-faq-item ${openFaq === i ? 'open' : ''}`} key={f.q}>
                                <button className='cli-faq-question' onClick={() => toggleFaq(i)}>
                                    {f.q}
                                    <ChevronDown size={16} className='cli-faq-chevron' />
                                </button>
                                {openFaq === i && <p className='cli-faq-answer'>{f.a}</p>}
                            </div>
                        ))}
                    </div>
                </section>

                <footer className='welcome-footer'>
                    <div className='welcome-footer-left'>
                        <p>&copy; 2026 TOTVS Context · Todos os direitos reservados.</p>
                    </div>
                    <div className='welcome-footer-right'>
                        <Link to='/welcome#about'>Sobre</Link>
                        <Link to='https://github.com/TOTVScontext' target='_blank'>GitHub</Link>
                        <Link to='/welcome'>Welcome</Link>
                    </div>
                </footer>

            </section>

        </main>
    )
}

export default Cli