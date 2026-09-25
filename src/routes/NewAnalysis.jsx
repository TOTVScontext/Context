import '../css/newAnalysis.css'
import Aside from "../components/Aside"
import Header from "../components/Header"
import { ChartBubblePacked, ChevronLeft, ChevronRight, DocumentAdd } from '@carbon/icons-react'
import gifLoading from '../assets/img/loadingAnalysis.gif'
import { useEffect, useState } from 'react'

const analysisSteps = [
    "Lendo a transcrição...",
    "Identificando os principais pontos da conversa...",
    "Analisando o contexto da reunião...",
    "Avaliando o sentimento ao longo da conversa...",
    "Identificando feedbacks e percepções...",
    "Analisando o nível de engajamento...",
    "Avaliando a qualidade da interação...",
    "Identificando possíveis riscos e oportunidades...",
    "Consolidando os principais insights...",
    "Finalizando a análise da reunião...",
    "Preparando tudo para enviar..."
];


const NewAnalysis = () => {

    const isLoading = false
    const isFile = false

    const [step, setStep] = useState(0);

    useEffect(() => {
        if (!isLoading) return;

        const totalDuration = 140_000;
        const stepDuration = totalDuration / (analysisSteps.length - 1);

        const timer = setTimeout(() => {
            setStep((current) => {
                if (current >= analysisSteps.length - 1) {
                    return current;
                }

                return current + 1;
            });
        }, stepDuration);

        return () => clearTimeout(timer);
    }, [isLoading, step]);

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
                            <h1>Gerando Análise da transcrição.</h1>
                            <p>Isso pode levar até um minuto dependendo do tamanho da transcrição.</p>
                            <img src={gifLoading} draggable={false} />
                            <h2>Status</h2>
                            <h3><div className='dotLoad' />{analysisSteps[step]}</h3>
                            <p>Estamos cuidando dos detalhes. Você pode pegar um café enquanto isso.</p>
                        </div>
                    }
                </section>
            </section>
        </main>
    )
}

export default NewAnalysis
