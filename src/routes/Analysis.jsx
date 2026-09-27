import { Link } from "react-router-dom"
import Aside from "../components/Aside"
import Header from "../components/Header"
import '../css/analysis.css'
import { FaceDissatisfied, FileX, NewTab } from "@carbon/icons-react"

const Analysis = () => {

    const isEmpty = false
    const isLoading = false

    return (
        <main className="analysis-main">
            <Aside />
            <section className="content-main">
                <Header />
                <section className="analysis-content">
                    <header className="analysis-header">
                        <div>
                            <h1>Análises</h1>
                            <p>Gerencie suas análises em um só lugar. Abra, renomeie ou exclua análises existentes e acesse rapidamente os resultados de cada conversa.</p>
                        </div>
                        <Link><NewTab size={15} />Nova análise</Link>
                    </header>
                    <section className="analysis-grid-main">
                        {isLoading ?
                            <section className="analysis-grid">
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                                <div className="analysis-card skeleton" />
                            </section>
                            :
                            isEmpty ?
                                <article className="analysis-empty">
                                    < FaceDissatisfied size={35} />
                                    <h1>Nenhuma análise por aqui</h1>
                                    <p>Suas análises aparecerão aqui assim que você enviar sua primeira transcrição.</p>
                                </article>
                                :
                                <section className="analysis-grid">
                                    <article className="analysis-card" >

                                    </article>
                                </section>
                        }
                    </section>
                </section>
            </section>
        </main >
    )
}

export default Analysis
