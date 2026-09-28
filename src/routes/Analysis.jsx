import { useEffect, useCallback, useState } from "react"
import { Link } from "react-router-dom"
import Aside from "../components/Aside"
import Header from "../components/Header"
import '../css/analysis.css'
import { Download, Edit, FaceDissatisfied, FileX, NewTab, TrashCan } from "@carbon/icons-react"
import { useAnalysis } from "../hooks/useAnalysis"

// O backend pode devolver "failure"; a tela de detalhe usa "fail". Aceitamos os dois.
const GOALS = {
    success: "Atendido",
    partial: "Parcial",
    fail: "Não atendido",
}

const normalizeGoal = (goal) => (goal === "failure" ? "fail" : goal)

const RELATIVE_UNITS = [
    { limit: 60, divisor: 1, unit: "second" },
    { limit: 3600, divisor: 60, unit: "minute" },
    { limit: 86400, divisor: 3600, unit: "hour" },
    { limit: 604800, divisor: 86400, unit: "day" },
]

const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" })
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

function formatDate(isoString) {
    if (!isoString) return "Data desconhecida"
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return "Data desconhecida"

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

    const cancelDelete = useCallback(() => setPendingDeleteId(null), [])

    const confirmDelete = useCallback(async (id) => {
        try {
            await deleteAnalysis(id)
            setPendingDeleteId(null)
        } catch {
            // o erro fica visível no card via deleteError
        }
    }, [deleteAnalysis])

    const stop = (event) => event.stopPropagation()

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
                        <Link to="/new"><NewTab size={14} />Nova análise</Link>
                    </header>

                    <section className="analysis-grid-main">
                        {isListLoading &&
                            <ul className="analysis-grid" aria-busy="true" aria-label="Carregando análises">
                                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                                    <li key={i} className="analysis-card analysis-card-skeleton skeleton" />
                                ))}
                            </ul>
                        }

                        {!isListLoading && listError &&
                            <article className="analysis-empty">
                                <FileX size={32} />
                                <h2>Não foi possível carregar suas análises</h2>
                                <p>{listError}</p>
                                <button type="button" onClick={() => fetchList(1)}>Tentar novamente</button>
                            </article>
                        }

                        {isEmpty &&
                            <article className="analysis-empty">
                                <FaceDissatisfied size={32} />
                                <h2>Nenhuma análise por aqui</h2>
                                <p>Suas análises aparecerão aqui assim que você enviar sua primeira transcrição.</p>
                            </article>
                        }

                        {!isListLoading && !listError && !isEmpty &&
                            <ul className="analysis-grid">
                                {list.map((item) => {
                                    const goal = normalizeGoal(item.goal)
                                    const isPendingDelete = pendingDeleteId === item.id
                                    const title = stripExtension(item.title)

                                    return (
                                        <li key={item.id} className="analysis-card">
                                            <header className="analysis-card-top">
                                                <span className="analysis-tag" data-goal={GOALS[goal] ? goal : "unknown"}>
                                                    <i />{GOALS[goal] ?? "Indefinido"}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="analysis-card-icon"
                                                    aria-label={`Excluir análise ${title}`}
                                                    onClick={() => setPendingDeleteId(item.id)}
                                                >
                                                    <TrashCan size={14} />
                                                </button>
                                            </header>

                                            <div className="analysis-card-heading">
                                                <h2>
                                                    <Link to={`/analysis/${item.id}`} className="analysis-card-link" title={title}>
                                                        {title}
                                                    </Link>
                                                </h2>
                                                <button type="button" className="analysis-card-icon" aria-label={`Renomear análise ${title}`}>
                                                    <Edit size={14} />
                                                </button>
                                            </div>

                                            <p className="analysis-card-summary">{getSummary(item.transcription)}</p>

                                            <footer className="analysis-card-footer">
                                                <dl>
                                                    <div>
                                                        <dt>Criada</dt>
                                                        <dd><time dateTime={item.created_at}>{formatDate(item.created_at)}</time></dd>
                                                    </div>
                                                    <div>
                                                        <dt>Transcrição</dt>
                                                        <dd>{item.size ?? "-"}</dd>
                                                    </div>
                                                </dl>
                                                <button type="button" className="analysis-card-pdf" aria-label={`Baixar PDF de ${title}`}>
                                                    <Download size={12} />PDF
                                                </button>
                                            </footer>

                                            {isPendingDelete &&
                                                <section
                                                    className="analysis-card-confirm"
                                                    role="alertdialog"
                                                    aria-label="Confirmar exclusão"
                                                    onClick={stop}
                                                    onKeyDown={(e) => e.key === "Escape" && cancelDelete()}
                                                >
                                                    <h3>Excluir esta análise?</h3>
                                                    <p>Esta ação é permanente e não poderá ser desfeita. Todos os dados relacionados a esta análise serão removidos.</p>
                                                    {deleteError && <p className="analysis-card-error" role="alert">{deleteError}</p>}
                                                    <div>
                                                        <button type="button" onClick={cancelDelete} disabled={isDeleting} autoFocus>Cancelar</button>
                                                        <button type="button" className="danger" onClick={() => confirmDelete(item.id)} disabled={isDeleting}>
                                                            {isDeleting ? "Excluindo..." : "Excluir"}
                                                        </button>
                                                    </div>
                                                </section>
                                            }
                                        </li>
                                    )
                                })}
                            </ul>
                        }
                    </section>
                </section>
            </section>
        </main>
    )
}

export default Analysis