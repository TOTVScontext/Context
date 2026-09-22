import '../css/home.css'
import Aside from "../components/Aside"
import Header from "../components/Header"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "@carbon/icons-react"
import banner from '../assets/img/banner.png'

const Home = () => {
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
                        <div className='home-news'>
                            <h1>Novidades TOTVS!</h1>
                            <section className='home-news-grid'>
                                <article>
                                    <h2></h2>
                                    <p></p>
                                    <h3></h3>
                                </article>
                            </section>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    )
}

export default Home
