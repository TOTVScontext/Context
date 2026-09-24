import '../css/newAnalysis.css'
import Aside from "../components/Aside"
import Header from "../components/Header"
import { ChartBubblePacked, DocumentAdd } from '@carbon/icons-react'

const NewAnalysis = () => {

    const isLoading = true
    const isFile = true

    return (
        <main className="newAnalysis-main">
            <Aside />
            <section className="content-main">
                <Header />
                <section className="newAnalysis-content">

                    {!isLoading ?
                        <div className='newAnalysis-new'>
                            <header>
                                <h1><ChartBubblePacked size={18} />Nova Análise</h1>
                                <p>Envie a transcrição em <span>.JSON</span> ou <span>.CSV</span> para gerar um diagnóstico completo de engajamento, comunicação, sentimento e risco comercial.</p>
                            </header>
                            <article className={`newAnalysis-upload ${isFile ? 'active' : ''}`}>
                                {isFile ?
                                    <>
                                        <div>
                                            <h2>transcricao002.json</h2>
                                            <footer>
                                                <span>JSON</span>
                                                <p>13,4 KB</p>
                                            </footer>
                                        </div>
                                        <footer>
                                            <button className='active'>Cancelar</button>
                                            <button>Gerar Análise</button>
                                        </footer>
                                    </>
                                    :
                                    <>
                                        <DocumentAdd size={35} />
                                        <h1>Arraste um arquivo para cá</h1>
                                        <p>ou se preferir...</p>
                                        <button>Selecione um arquivo</button>
                                    </>
                                }
                            </article>
                        </div>
                        :
                        <div className='newAnalysis-loading'>
                            <h1>Gerando Análise da transcrição</h1>
                        </div>
                    }
                </section>
            </section>
        </main>
    )
}

export default NewAnalysis
