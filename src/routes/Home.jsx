import '../css/home.css'
import Aside from "../components/Aside"
import Header from "../components/Header"
import { Link } from "react-router-dom"
import { ArrowUpRight, Education, Launch, ProgressBarRound, ShapeExclude, Terminal } from "@carbon/icons-react"
import banner from '../assets/img/banner.png'
import { useNewsList } from '../hooks/useNews'

const Home = () => {

    const { news, isloading, error } = useNewsList()

    function formatDate(date) {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    const closeAside = () => {
        localStorage.setItem('aside_open', 'false')
        window.dispatchEvent(new Event('aside-toggle'))
    }

    return (
        <main className="home-main">
            <Aside />
            <section className="content-main">
                <Header />
                <div className='home-content-scrool'>
                    <section className='home-content'>
                        <div className='img'>
                            <img src={banner} draggable={false} />
                        </div>
                        <div className="home-cta">
                            <h1>Entenda o que acontece nas suas reuniões</h1>
                            <h2>O Context transforma transcrições de reuniões em uma visão estruturada e inteligente sobre cada conversa. A solução utiliza Inteligência Artificial para identificar sentimento, engajamento, feedbacks, riscos e oportunidades, além de avaliar a saúde do relacionamento com o cliente.<br /><br />A partir desses dados, a plataforma organiza os principais pontos da reunião e gera insights que ajudam a compreender melhor o cenário, identificar pontos de atenção e apoiar decisões mais assertivas após cada conversa.</h2>
                            <Link to='/analysis'>Criar nova análise <ArrowUpRight size={16} /></Link>
                        </div>

                        <div className='hr' />

                        <section className='home-features'>
                            <header className='home-features-header'>
                                <h1>Mais do que uma análise.<br />É inteligência para suas reuniões.</h1>
                                <p>Analise suas reuniões com métricas de sentimento, engajamento e risco, extraia feedbacks e pontos relevantes automaticamente e acompanhe os principais indicadores em um só lugar. Com o Context CLI, leve essas análises para seus próprios fluxos de trabalho.</p>
                            </header>
                            <div className='home-features-grid'>
                                <Link onClick={() => closeAside()} to='/chat' className='home-features-card'>
                                    <h1>Context AI&reg;</h1>
                                    <h2>Analise reuniões com inteligência artificial, extraindo sentimentos, feedbacks, indicadores de desempenho e possíveis riscos a partir das conversas.</h2>
                                    <footer>
                                        <ShapeExclude className='icon' size={27} />
                                        <Link><Launch size={18} /></Link>
                                    </footer>
                                </Link>

                                <Link to='/cli' className='home-features-card'>
                                    <h1>Context CLI&trade;</h1>
                                    <h2>Acesse os recursos do Context diretamente pelo terminal, integrando análises de reuniões aos seus fluxos de trabalho e aplicações.</h2>
                                    <footer>
                                        <Terminal className='icon' size={27} />
                                        <Link><Launch size={18} /></Link>
                                    </footer>
                                </Link>

                                <Link to='' className='home-features-card'>
                                    <h1>Educação</h1>
                                    <h2>Aprimore seus conhecimentos com cursos e treinamentos em diferentes áreas, desenvolvidos para apoiar seu aprendizado e evolução profissional.</h2>
                                    <footer>
                                        <Education className='icon' size={27} />
                                        <Link><Launch size={18} /></Link>
                                    </footer>
                                </Link>
                            </div>
                        </section>

                        <div className='hr' />

                        {!error &&
                            <div className='home-news'>
                                <header className='home-news-header'>
                                    <h1>Novidades TOTVS!</h1>
                                    <Link to='https://www.totvs.com/blog/'>TOTVS blog <ArrowUpRight size={16} /></Link>
                                </header>
                                <section className='home-news-grid'>
                                    {isloading && <p className='home-news-loading'><ProgressBarRound className='loop' size={20} /></p>}
                                    {!isloading && (
                                        news.map((item) => (
                                            <>
                                                <article onClick={() => window.open(`${item.redirection}`)} key={item.id}>
                                                    <h2>{item.title}</h2>
                                                    <h3>{item.subtitle}</h3>
                                                    <p>{item.content}</p>
                                                    <h4>{formatDate(item.created_at)}</h4>
                                                </article>
                                                <div className="hr" />
                                            </>
                                        ))
                                    )}
                                </section>
                            </div>
                        }
                    </section>
                    <footer className='home-footer'>
                        <p>Entenda o que foi dito, identifique o que importa e saiba onde agir.</p>
                    </footer>
                </div>
            </section>
        </main>
    )
}

export default Home
