import '../css/newAnalysis.css'
import Aside from "../components/Aside"
import Header from "../components/Header"
import { ChartBubblePacked, ChevronLeft, ChevronRight, DocumentAdd, DocumentImport } from '@carbon/icons-react'
import gifLoading from '../assets/img/loadingAnalysis.gif'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalysis, STAGES } from '../hooks/useAnalysis'

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

const ACCEPTED_EXTENSIONS = ['.json', '.csv']

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileLabel(file) {
    const ext = file.name.split('.').pop()
    return ext ? ext.toUpperCase() : ''
}

function isAcceptedFile(file) {
    const name = file.name.toLowerCase()
    return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))
}

const NewAnalysis = () => {
    const navigate = useNavigate()
    const { isLoading, stage, error, result, analyzeFile, reset } = useAnalysis()

    const [selectedFile, setSelectedFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [step, setStep] = useState(0)
    const [validationError, setValidationError] = useState(null)

    const dragCounterRef = useRef(0)
    const fileInputRef = useRef(null)

    const isFile = Boolean(selectedFile)

    useEffect(() => {
        if (!isLoading) return

        const totalDuration = 180_000
        const stepDuration = totalDuration / (analysisSteps.length - 1)

        const timer = setTimeout(() => {
            setStep((current) => {
                if (current >= analysisSteps.length - 1) return current
                return current + 1
            })
        }, stepDuration)

        return () => clearTimeout(timer)
    }, [isLoading, step])

    useEffect(() => {
        if (result?.id) navigate(`/analysis/${result.id}`)
    }, [result, navigate])

    const handleFileSelected = useCallback((file) => {
        if (!file) return

        if (!isAcceptedFile(file)) {
            setValidationError('Formato inválido. Envie um arquivo .JSON ou .CSV')
            return
        }

        setValidationError(null)
        setSelectedFile(file)
    }, [])

    const handleInputChange = useCallback((event) => {
        const file = event.target.files?.[0]
        handleFileSelected(file)
        event.target.value = ''
    }, [handleFileSelected])

    const handleBrowseClick = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const handleDragEnter = useCallback((event) => {
        event.preventDefault()
        dragCounterRef.current += 1
        setIsDragging(true)
    }, [])

    const handleDragOver = useCallback((event) => {
        event.preventDefault()
    }, [])

    const handleDragLeave = useCallback((event) => {
        event.preventDefault()
        dragCounterRef.current -= 1
        if (dragCounterRef.current <= 0) {
            dragCounterRef.current = 0
            setIsDragging(false)
        }
    }, [])

    const handleDrop = useCallback((event) => {
        event.preventDefault()
        dragCounterRef.current = 0
        setIsDragging(false)

        const file = event.dataTransfer.files?.[0]
        handleFileSelected(file)
    }, [handleFileSelected])

    const handleCancel = useCallback(() => {
        setSelectedFile(null)
        setValidationError(null)
        setStep(0)
        reset()
    }, [reset])

    const handleGenerate = useCallback(() => {
        if (!selectedFile) return
        setStep(0)
        analyzeFile(selectedFile, { title: selectedFile.name }).catch(() => { })
    }, [selectedFile, analyzeFile])

    const stageMessage = stage === STAGES.ANALYZING
        ? analysisSteps[Math.min(step, analysisSteps.length - 1)]
        : analysisSteps[0]

    return (
        <main
            className={`newAnalysis-main`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
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

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json,.csv"
                                onChange={handleInputChange}
                                hidden
                            />

                            <article
                                className={`newAnalysis-upload ${isFile ? 'active' : ''}`}
                            >
                                {isFile ?
                                    <>
                                        <div>
                                            <h2>{selectedFile.name}</h2>
                                            <footer>
                                                <span>{getFileLabel(selectedFile)}</span>
                                                <p>{formatFileSize(selectedFile.size)}</p>
                                            </footer>
                                        </div>
                                        <footer>
                                            <button className='active' onClick={handleCancel}>Cancelar</button>
                                            <button onClick={handleGenerate}>Gerar Análise</button>
                                        </footer>
                                    </>
                                    :
                                    <>
                                        <DocumentAdd size={35} />
                                        <h1>Arraste um arquivo para cá</h1>
                                        <p>ou se preferir...</p>
                                        <button onClick={handleBrowseClick}>Selecione um arquivo</button>
                                    </>
                                }
                            </article>

                            {(validationError || error) &&
                                <p className='newAnalysis-error'>{validationError || error}</p>
                            }
                        </div>
                        :
                        <div className='newAnalysis-loading'>
                            <h1>Gerando Análise da transcrição.</h1>
                            <p>Isso pode levar até um minuto dependendo do tamanho da transcrição.</p>
                            <img src={gifLoading} draggable={false} />
                            <h2>Status</h2>
                            <h3><div className='dotLoad' />{stageMessage}</h3>
                            <p>Estamos cuidando dos detalhes. Você pode pegar um café enquanto isso.</p>
                        </div>
                    }
                </section>
            </section>
            {isDragging &&
                <div className='newAnalysis-drop'>
                    <DocumentImport size={50} />
                    <h1>Solte para continuar</h1>
                    <p>Arraste o arquivo até aqui e deixe o Context fazer o resto.</p>
                </div>}
        </main>
    )
}

export default NewAnalysis