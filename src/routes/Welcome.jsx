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
                        <h1>Toda Conversa Conta. O Context Conecta Comunicação e Resultado.</h1>
                        <p>O Context transforma conversas corporativas em métricas, insights e decisões inteligentes por meio de inteligência artificial avançada.</p>
                        <div>
                            <Link to='/login?view=login' className='active'><Chrome size={20} />Fazer LogIn</Link>
                            <Link to='/cli'><Download size={20} />Baixar Context CLI</Link>
                        </div>
                    </article>
                    <article className='welcome-presentation-right'>
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/analisis-de-grandes-datos-illustration-svg-download-png-3220037.png" />
                    </article>
                </section>

                <section className='welcome-cli'>
                    <div className='welcome-about-cli'>
                        <article className='welcome-about-cli-left'>
                            <span className='welcome-about-label'>Context CLI</span>
                            <h2>Poder de análise direto no seu terminal</h2>
                            <p>Para times técnicos e fluxos automatizados, o Context CLI permite enviar transcrições e receber insights diretamente pela linha de comando, integrável a qualquer pipeline.</p>
                            <Link to='/cli'><Download size={18} />Baixar Context CLI</Link>
                        </article>
                        <div className='welcome-about-cli-right'>
                            <div className='welcome-about-cli-terminal-bar'>
                                <span className='welcome-about-cli-terminal-dot red'></span>
                                <span className='welcome-about-cli-terminal-dot yellow'></span>
                                <span className='welcome-about-cli-terminal-dot green'></span>
                            </div>
                            <div className='welcome-about-cli-terminal-body'>
                                <div className='welcome-about-cli-line'><span className='prompt'>$</span><span className='cmd'>context analyze ./reuniao-vendas.txt</span></div>
                                <div className='welcome-about-cli-line'><span className='output'>→ Processando transcrição...</span></div>
                                <div className='welcome-about-cli-line'><span className='highlight'>✔ Análise concluída</span></div>
                                <div className='welcome-about-cli-line'><span className='output'>Sentimento geral: </span><span className='success'>Positivo (82%)</span></div>
                                <div className='welcome-about-cli-line'><span className='output'>Engajamento:      </span><span className='info'>Alto (91%)</span></div>
                                <div className='welcome-about-cli-line'><span className='output'>→ Relatório salvo em ./context-report.pdf</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='welcome-numbers-section'>
                    <span className='welcome-about-label' style={{ textAlign: 'center', display: 'block', marginBottom: '28px' }}>
                        Resultados que gestores enxergam
                    </span>
                    <div className='welcome-numbers'>
                        <div className='welcome-numbers-item'>
                            <div className='welcome-numbers-item-value'>3<span>×</span></div>
                            <p>mais visibilidade sobre o desempenho do time em reuniões e chamadas</p>
                        </div>
                        <div className='welcome-numbers-item'>
                            <div className='welcome-numbers-item-value'>-70<span>%</span></div>
                            <p>no tempo gasto revisando conversas manualmente para tomar decisões</p>
                        </div>
                        <div className='welcome-numbers-item'>
                            <div className='welcome-numbers-item-value'>+40<span>%</span></div>
                            <p>de assertividade nas decisões quando baseadas em dados reais de interação</p>
                        </div>
                    </div>
                </section>

                <section className='welcome-how'>
                    <div className='welcome-how-inner'>
                        <article className='welcome-how-left'>
                            <span className='welcome-about-label'>Como funciona</span>
                            <h2>Simples para quem usa. Poderoso para quem decide.</h2>
                            <p>Você não precisa saber nada de tecnologia. O Context trabalha por você — do upload ao insight em minutos.</p>
                        </article>
                        <div className='welcome-how-right'>
                            {[
                                { n: '01', title: 'Envie a transcrição da reunião', desc: 'Cole o texto ou faça o upload do arquivo. O Context aceita qualquer formato de texto de chamada ou reunião.' },
                                { n: '02', title: 'O Context analisa automaticamente', desc: 'Em segundos, a plataforma identifica o tom, o engajamento, os pontos de atrito e os destaques da conversa.' },
                                { n: '03', title: 'Você recebe um painel claro', desc: 'Veja o que foi bem, o que precisa melhorar e o que fazer na próxima reunião. Sem interpretação — só ação.' },
                                { n: '04', title: 'Acompanhe a evolução do time', desc: 'Compare períodos, identifique padrões e veja sua equipe crescer com base em dados reais.' },
                            ].map((s) => (
                                <div className='welcome-how-step' key={s.n}>
                                    <span className='welcome-how-step-n'>{s.n}</span>
                                    <div className='welcome-how-step-body'>
                                        <h3>{s.title}</h3>
                                        <p>{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className='welcome-problem-section'>
                    <div className='welcome-problem'>
                        <article className='welcome-problem-left'>
                            <span className='welcome-about-label'>O problema que resolvemos</span>
                            <h2>Suas reuniões valem mais do que você imagina.</h2>
                            <p>Decisões, oportunidades e alertas aparecem todo dia nas conversas do seu time — mas ficam perdidos. O Context transforma isso em clareza.</p>
                        </article>
                        <div className='welcome-problem-right'>
                            {[
                                { title: 'Você sabe o que foi dito. Mas não o que ficou.', desc: 'Objeções de clientes, sinais de alerta e alinhamentos importantes somem depois da ligação.' },
                                { title: 'Feedback do time vira opinião, não dado.', desc: 'Sem métricas objetivas, é difícil saber quem está evoluindo e quem precisa de suporte.' },
                                { title: 'Cada gestor vê diferente. Ninguém vê tudo.', desc: 'Visões descentralizadas geram decisões inconsistentes e perda de oportunidades.' },
                            ].map((c) => (
                                <div className='welcome-problem-card' key={c.title}>
                                    <div className='welcome-problem-card-dot'></div>
                                    <div>
                                        <h3>{c.title}</h3>
                                        <p>{c.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className='welcome-totvs' id='totvs'>
                    <div className='welcome-totvs-inner'>
                        <article className='welcome-totvs-left'>
                            <span className='welcome-about-label'>TOTVS</span>
                            <h2>Construído para o mercado corporativo brasileiro.</h2>
                            <p>O Context foi desenvolvido como parte do ecossistema TOTVS, pensado para empresas que já usam tecnologia no dia a dia e querem extrair mais valor das suas operações.</p>
                        </article>
                        <div className='welcome-totvs-right'>
                            <div className='welcome-totvs-stat'>
                                <span className='welcome-totvs-stat-val'>+50k</span>
                                <p className='welcome-totvs-stat-text'>empresas confiam no ecossistema TOTVS para gerir seus negócios no Brasil</p>
                            </div>
                            <div className='welcome-totvs-stat'>
                                <span className='welcome-totvs-stat-val'>100%</span>
                                <p className='welcome-totvs-stat-text'>focado em organizações que dependem de comunicação para gerar resultado</p>
                            </div>
                            <div className='welcome-totvs-stat'>
                                <span className='welcome-totvs-stat-val'>1 min</span>
                                <p className='welcome-totvs-stat-text'>é suficiente para ter o primeiro insight sobre qualquer reunião ou chamada</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='welcome-plans' id='plans'>
                    <span className='welcome-about-label' style={{ textAlign: 'center', display: 'block' }}>Planos</span>
                    <h2>O plano certo para o tamanho do seu time</h2>
                    <p>Comece grátis e escale conforme crescer</p>
                    <div className='welcome-plans-grid'>
                        <div className='welcome-plans-card'>
                            <span className='welcome-plans-card-name'>Starter</span>
                            <div className='welcome-plans-card-price'>Grátis <span>/ para sempre</span></div>
                            <p>Para quem quer experimentar e ver o valor antes de qualquer compromisso.</p>
                            <hr />
                            <span className='welcome-plans-card-feat'>Até 10 análises por mês</span>
                            <span className='welcome-plans-card-feat'>Painel com resultados por reunião</span>
                            <span className='welcome-plans-card-feat'>1 usuário</span>
                            <Link to='/login?view=register' className='welcome-plans-card-btn'>Começar grátis</Link>
                        </div>
                        <div className='welcome-plans-card active'>
                            <span className='welcome-plans-card-badge'>Mais popular</span>
                            <span className='welcome-plans-card-name'>Pro</span>
                            <div className='welcome-plans-card-price'>R$149 <span>/ mês</span></div>
                            <p>Para times que precisam de visibilidade contínua sobre performance e comunicação.</p>
                            <hr />
                            <span className='welcome-plans-card-feat'>Análises ilimitadas</span>
                            <span className='welcome-plans-card-feat'>Painel comparativo por período</span>
                            <span className='welcome-plans-card-feat'>Até 10 usuários</span>
                            <span className='welcome-plans-card-feat'>Exportação de relatórios</span>
                            <Link to='/login?view=register' className='welcome-plans-card-btn'>Assinar Pro</Link>
                        </div>
                        <div className='welcome-plans-card'>
                            <span className='welcome-plans-card-name'>Enterprise</span>
                            <div className='welcome-plans-card-price'>Sob consulta</div>
                            <p>Para operações maiores com integração, controle e suporte dedicado.</p>
                            <hr />
                            <span className='welcome-plans-card-feat'>Tudo do Pro</span>
                            <span className='welcome-plans-card-feat'>Usuários ilimitados</span>
                            <span className='welcome-plans-card-feat'>Integração com suas ferramentas</span>
                            <span className='welcome-plans-card-feat'>Suporte com SLA garantido</span>
                            <Link to='/login?view=register' className='welcome-plans-card-btn'>Falar com a equipe</Link>
                        </div>
                    </div>
                </section>

                <section className='welcome-cta'>
                    <div className='welcome-cta-inner'>
                        <h2>Sua próxima reunião já contém a resposta. O Context <em>encontra para você.</em></h2>
                        <div className='welcome-cta-actions'>
                            <Link to='/login?view=register' className='welcome-cta-primary'>Criar conta grátis</Link>
                            <Link to='#support' className='welcome-cta-secondary'>Falar com a equipe</Link>
                        </div>
                    </div>
                </section>

                <footer className='welcome-footer'>
                    <div className='welcome-footer-left'>
                        <p>&copy; 2026 TOTVS Context · Todos os direitos reservados.</p>
                    </div>
                    <div className='welcome-footer-right'>
                        <Link to='#about'>Sobre</Link>
                        <Link to='https://github.com/TOTVScontext' target='_blank'>GitHub</Link>
                        <Link to='/cli'>Context CLI</Link>
                    </div>
                </footer>

            </section>

        </main>
    )
}

export default Welcome
