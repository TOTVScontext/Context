import { useEffect, useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Aside from "../components/Aside"
import Header from "../components/Header"
import '../css/analysis.css'
import { Download, Edit, FaceDissatisfied, FileX, NewTab, TrashCan } from "@carbon/icons-react"
import { useAnalysis } from "../hooks/useAnalysis"

const GOAL_LABELS = {
    success: "atendido",
    failure: "falhou",
    partial: "parcial",
}

const RELATIVE_UNITS = [
    { limit: 60, divisor: 1, unit: "second" },
    { limit: 3600, divisor: 60, unit: "minute" },
    { limit: 86400, divisor: 3600, unit: "hour" },
    { limit: 604800, divisor: 86400, unit: "day" },
]

const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" })
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

function formatDate(isoString) {
    if (!isoString) return "data desconhecida"
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return "data desconhecida"

    const diffSeconds = (Date.now() - date.getTime()) / 1000

    if (diffSeconds >= 0 && diffSeconds < 604800) {
        for (const { limit, divisor, unit } of RELATIVE_UNITS) {
            if (diffSeconds < limit) {
                return rtf.format(-Math.floor(diffSeconds / divisor), unit)
            }
        }
    }

    return dateFormatter.format(date)
}

function objectiveModifierClass(goal) {
    switch (goal) {
        case "success":
            return "is-success"
        case "failure":
            return "is-failure"
        case "partial":
            return "is-partial"
        default:
            return "is-unknown"
    }
}

function stripExtension(name = "") {
    const idx = name.lastIndexOf(".")
    return idx > 0 ? name.slice(0, idx) : name
}

function getSummary(transcriptionRaw) {
    try {
        const parsed = JSON.parse(transcriptionRaw)
        return parsed?.summary?.short || "Resumo indisponível para esta análise."
    } catch {
        return "Resumo indisponível para esta análise."
    }
}

const SKELETON_COUNT = 15

const Analysis = () => {
    const navigate = useNavigate()
    const [pendingDeleteId, setPendingDeleteId] = useState(null)

    const {
        list,
        isListLoading,
        listError,
        fetchList,
        isDeleting,
        deleteError,
        deleteAnalysis,
    } = useAnalysis()

    useEffect(() => {
        fetchList(1)
    }, [fetchList])

    const isEmpty = !isListLoading && !listError && list.length === 0

    const requestDelete = useCallback((e, id) => {
        e.stopPropagation()
        setPendingDeleteId(id)
    }, [])

    const cancelDelete = useCallback((e) => {
        e.stopPropagation()
        setPendingDeleteId(null)
    }, [])

    const confirmDelete = useCallback(async (e, id) => {
        e.stopPropagation()
        try {
            await deleteAnalysis(id)
        } finally {
            setPendingDeleteId(null)
        }
    }, [deleteAnalysis])

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
                        <Link to="/analysis/new"><NewTab size={14} />Nova análise</Link>
                    </header>
                    <section className="analysis-grid-main">
                        {isListLoading ?
                            <section className="analysis-grid">
                                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                                    <div key={i} className="analysis-card skeleton" />
                                ))}
                            </section>
                            :
                            listError ?
                                <article className="analysis-empty">
                                    <FileX size={35} />
                                    <h1>Não foi possível carregar suas análises</h1>
                                    <p>{listError}</p>
                                </article>
                                :
                                isEmpty ?
                                    <article className="analysis-empty">
                                        <FaceDissatisfied size={35} />
                                        <h1>Nenhuma análise por aqui</h1>
                                        <p>Suas análises aparecerão aqui assim que você enviar sua primeira transcrição.</p>
                                    </article>
                                    :
                                    <section className="analysis-grid">
                                        {list.map((item) => {
                                            const isPendingDelete = pendingDeleteId === item.id
                                            return (
                                                <article
                                                    key={item.id}
                                                    onClick={() => !isPendingDelete && navigate(`/analysis/${item.id}`)}
                                                    className="analysis-card"
                                                >
                                                    {isPendingDelete ? (
                                                        <section className="analysis-card-confirm-delete" onClick={(e) => e.stopPropagation()}>
                                                            <h1>Excluir esta análise?</h1>
                                                            <p>Esta ação é permanente e não poderá ser desfeita. Todos os dados relacionados a esta análise serão removidos.</p>
                                                            <span>
                                                                <button onClick={cancelDelete} disabled={isDeleting}>Cancelar</button>
                                                                <button onClick={(e) => confirmDelete(e, item.id)} disabled={isDeleting}>
                                                                    {isDeleting ? "Excluindo..." : "Confirmar"}
                                                                </button>
                                                            </span>
                                                            {deleteError && <p className="analysis-card-error">{deleteError}</p>}
                                                        </section>
                                                    ) : (
                                                        <button
                                                            className="analysis-card-open-modal"
                                                            onClick={(e) => requestDelete(e, item.id)}
                                                        >
                                                            <TrashCan size={14} />
                                                        </button>
                                                    )}
                                                    <div>
                                                        <p>{getSummary(item.transcription)}</p>
                                                    </div>
                                                    <article>
                                                        <h1>{stripExtension(item.title)}</h1>
                                                        <button><Edit size={14} /></button>
                                                    </article>
                                                    <section>
                                                        <h2>Objetivo: <span className={objectiveModifierClass(item.goal)}>{GOAL_LABELS[item.goal] || "indefinido"}</span></h2>
                                                        <h2>tam. da transcrição: <span>{item.size}</span></h2>
                                                    </section>
                                                    <footer className="analysis-card-footer">
                                                        <p>{formatDate(item.created_at)}</p>
                                                        <button><Download size={12} />PDF</button>
                                                    </footer>
                                                </article>
                                            )
                                        })}
                                    </section>
                        }
                    </section>
                </section>
            </section>
        </main>
    )
}

export default Analysis