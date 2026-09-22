import '../css/home.css'
import Aside from "../components/Aside"
import Header from "../components/Header"
import { Link } from "react-router-dom"
import { ArrowUpRight, ProgressBarRound } from "@carbon/icons-react"
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

                        {!error &&
                            <div className='home-news'>
                                <header className='home-news-header'>
                                    <h1>Novidades TOTVS!</h1>
                                    <Link to='https://www.totvs.com/blog/'>TOTVS blog <ArrowUpRight size={16}/></Link>
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
