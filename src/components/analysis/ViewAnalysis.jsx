import '../../css/viewAnalysis.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, ArrowRight, ChevronRight, Dashboard, Events, FileX, Portfolio, WarningAlt } from '@carbon/icons-react'
import Aside from '../Aside'
import Header from '../Header'
import EChart from './EChart'
import { useAnalysis } from '../../hooks/useAnalysis'
import {
    GOAL_INFO,
    RISK_SCALE,
    SECTIONS,
    SUMMARY_SECTION,
    buildProfileOption,
    buildSectionOption,
    clamp,
    formatValue,
    getRiskBand,
    getRiskColor,
    getScoreBand,
    getTopRisk,
    hasAnyScore,
    rankIndicators,
    readValue,
    sectionAverage,
} from './analysisCharts'

const TABS = [
    { id: 'overview', label: 'Visão geral', icon: <Dashboard size={15} /> },
    { id: 'meeting', label: 'Reunião', icon: <Events size={15} /> },
    { id: 'business', label: 'Cliente e negócio', icon: <Portfolio size={15} /> },
    { id: 'risks', label: 'Riscos', icon: <WarningAlt size={15} /> },
]

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const remarkPlugins = [remarkGfm]

const markdownComponents = {
    a({ href, children, ...props }) {
        return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
    },
    table({ children, ...props }) {
        return (
            <div className="md-table-wrapper">
                <table {...props}>{children}</table>
            </div>
        )
    },
}

const stripExtension = (name = '') => {
    const idx = name.lastIndexOf('.')
    return idx > 0 ? name.slice(0, idx) : name
}

const formatDate = (isoString) => {
    const date = new Date(isoString)
    return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date)
}

const Bar = ({ value, color }) => (
    <div className="viewAnalysis-bar">
        <span style={{ width: `${clamp(value)}%`, ...(color && { background: color }) }} />
    </div>
)

const Panel = ({ title, description, span, aside, children }) => (
    <article className={`viewAnalysis-panel span-${span}`}>
        <header>
            <div>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            {aside}
        </header>
        {children}
    </article>
)

const RankList = ({ title, items }) => (
    <section className="viewAnalysis-rail-block">
        <h3>{title}</h3>
        <ul className="viewAnalysis-rank">
            {items.map((item) => (
                <li key={item.id}>
                    <div>
                        <span>{item.label}<em>{item.dimension}</em></span>
                        <strong>{formatValue(item.value)}</strong>
                    </div>
                    <Bar value={item.value} />
                </li>
            ))}
        </ul>
    </section>
)

const ViewAnalysisContent = () => {
    const { id } = useParams()
    const { status, error, result, fetchAnalysis } = useAnalysis()
    const [activeTab, setActiveTab] = useState('overview')
    const scrollRef = useRef(null)

    useEffect(() => {
        const controller = new AbortController()
        fetchAnalysis(id, { signal: controller.signal }).catch(() => { })
        return () => controller.abort()
    }, [id, fetchAnalysis])

    const analysisData = result?.analysis_data
    const hasScores = hasAnyScore(analysisData)

    const model = useMemo(() => {
        if (!hasScores) return null

        const riskSection = SECTIONS.find((section) => section.inverted)
        const exposure = sectionAverage(riskSection, analysisData)
        const kpis = [
            ...Object.entries(SUMMARY_SECTION.labels).map(([key, label]) => ({
                key,
                label,
                value: readValue(analysisData, SUMMARY_SECTION.key, key),
                description: SUMMARY_SECTION.descriptions[key],
            })),
            {
                key: 'goal_achievement',
                label: 'Cumprimento do objetivo',
                value: readValue(analysisData, 'meeting_analysis', 'goal_achievement'),
                description: SUMMARY_SECTION.descriptions.goal_achievement,
            },
        ]

        return {
            kpis,
            profile: buildProfileOption(analysisData),
            ranking: rankIndicators(analysisData),
            topRisk: getTopRisk(analysisData),
            exposure,
            sections: SECTIONS.map((section) => ({
                section,
                option: buildSectionOption(section, analysisData),
                average: sectionAverage(section, analysisData),
            })),
        }
    }, [hasScores, analysisData])

    const tabs = hasScores ? TABS : []
    const isPending = status === 'idle' || status === 'loading'
    const isError = status === 'error'
    const isReady = !isPending && !isError && Boolean(result)
    const title = isError ? 'Análise' : stripExtension(result?.title)
    const createdAt = result?.created_at ? formatDate(result.created_at) : null
    const goal = GOAL_INFO[result?.goal]

    const selectTab = (tabId) => {
        setActiveTab(tabId)
        scrollRef.current?.scrollTo({ top: 0 })
    }

    const handleTabKeyDown = (event) => {
        const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
        if (!keys.includes(event.key)) return
        event.preventDefault()
        const index = tabs.findIndex((tab) => tab.id === activeTab)
        const next =
            event.key === 'Home' ? 0
                : event.key === 'End' ? tabs.length - 1
                    : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
        selectTab(tabs[next].id)
        document.getElementById(`viewAnalysis-tab-${tabs[next].id}`)?.focus()
    }

    const renderSection = ({ section, option, average }) => (
        <Panel
            key={section.key}
            title={section.title}
            description={section.description}
            span={section.span}
            aside={<span className="viewAnalysis-average">Média <strong>{formatValue(average)}</strong></span>}
        >
            <EChart
                option={option}
                height={section.type === 'radar' ? 290 : 230}
                ariaLabel={`Gráfico: ${section.title}`}
            />
        </Panel>
    )

    const report = result?.analysis && (
        <article className="viewAnalysis-report">
            <h2>Relatório executivo</h2>
            <div className="markdown-content">
                <ReactMarkdown remarkPlugins={remarkPlugins} components={markdownComponents}>
                    {result.analysis}
                </ReactMarkdown>
            </div>
        </article>
    )

    return (
        <main className="viewAnalysis-main">
            <Aside />
            <section className="content-main">
                <Header />
                <section className="viewAnalysis-content">
                    <div className="viewAnalysis-top">
                        <nav className="viewAnalysis-breadcrumb" aria-label="Você está em">
                            <Link to="/analysis"><ArrowLeft size={14} />Análises</Link>
                            <ChevronRight size={12} aria-hidden="true" />
                            <span aria-current="page">{isPending ? 'Carregando' : title}</span>
                        </nav>

                        <header className="viewAnalysis-header">
                            {isPending
                                ? <span className="viewAnalysis-title-skeleton skeleton" />
                                : <h1>{title}</h1>}
                            {isReady &&
                                <dl className="viewAnalysis-meta">
                                    <div>
                                        <dt>Objetivo</dt>
                                        <dd className="viewAnalysis-tag" data-goal={result.goal ?? 'unknown'}>
                                            <i />{goal?.label ?? 'Indefinido'}
                                        </dd>
                                    </div>
                                    {result.size && <div><dt>Transcrição</dt><dd>{result.size}</dd></div>}
                                    {createdAt && <div><dt>Criada em</dt><dd>{createdAt}</dd></div>}
                                </dl>
                            }
                        </header>

                        {isPending && <div className="viewAnalysis-tabs-skeleton skeleton" />}

                        {isReady && tabs.length > 0 &&
                            <div className="viewAnalysis-tabs" role="tablist" aria-label="Seções da análise" onKeyDown={handleTabKeyDown}>
                                {tabs.map(({ id: tabId, label, icon }) => (
                                    <button
                                        key={tabId}
                                        id={`viewAnalysis-tab-${tabId}`}
                                        role="tab"
                                        type="button"
                                        aria-selected={activeTab === tabId}
                                        aria-controls="viewAnalysis-panel"
                                        tabIndex={activeTab === tabId ? 0 : -1}
                                        className={activeTab === tabId ? 'active' : ''}
                                        onClick={() => selectTab(tabId)}
                                    >
                                        {icon}{label}
                                    </button>
                                ))}
                            </div>
                        }

                    </div>

                    <div className="viewAnalysis-scroll" ref={scrollRef}>
                        <section
                            id="viewAnalysis-panel"
                            role={isReady && tabs.length > 0 ? 'tabpanel' : undefined}
                            aria-labelledby={isReady && tabs.length > 0 ? `viewAnalysis-tab-${activeTab}` : undefined}
                            className="viewAnalysis-body"
                        >
                            {isPending &&
                                <div className="viewAnalysis-grid">
                                    <div className="viewAnalysis-skeleton skeleton span-12" />
                                    <div className="viewAnalysis-skeleton skeleton tall span-8" />
                                    <div className="viewAnalysis-skeleton skeleton tall span-4" />
                                </div>
                            }

                            {isError &&
                                <article className="viewAnalysis-empty">
                                    <FileX size={32} />
                                    <h2>Não foi possível carregar a análise</h2>
                                    <p>{error}</p>
                                    <Link to="/analysis"><ArrowLeft size={14} />Voltar para análises</Link>
                                </article>
                            }

                            {isReady && !hasScores &&
                                <>
                                    <div className="viewAnalysis-notice" role="status">
                                        <WarningAlt size={18} />
                                        <p><strong>Métricas indisponíveis.</strong> Não foi possível gerar os indicadores quantitativos desta análise. O relatório executivo está disponível abaixo.</p>
                                    </div>
                                    {report}
                                </>
                            }

                            {isReady && activeTab === 'overview' && model &&
                                <>
                                    <div className="viewAnalysis-kpis">
                                        {model.kpis.map((kpi) => (
                                            <div key={kpi.key} className="viewAnalysis-kpi">
                                                <span>{kpi.label}</span>
                                                <p><strong>{formatValue(kpi.value)}</strong> / 100</p>
                                                <Bar value={kpi.value} />
                                                <small><b>{getScoreBand(kpi.value)}.</b> {kpi.description}</small>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="viewAnalysis-overview">
                                        <div className="viewAnalysis-overview-main">
                                            {report ?? <p className="viewAnalysis-muted">Esta análise não tem relatório textual.</p>}
                                        </div>

                                        <aside className="viewAnalysis-rail" aria-label="Leitura rápida">
                                            <section className="viewAnalysis-rail-block">
                                                <h3>Objetivo da reunião</h3>
                                                <p className="viewAnalysis-tag" data-goal={result.goal ?? 'unknown'}>
                                                    <i />{goal?.label ?? 'Indefinido'}
                                                </p>
                                                <p className="viewAnalysis-hint">{goal?.description ?? 'Não foi possível determinar o cumprimento do objetivo.'}</p>
                                            </section>

                                            <section className="viewAnalysis-rail-block viewAnalysis-toprisk" style={{ '--risk': getRiskColor(model.topRisk.value) }}>
                                                <h3>Maior risco</h3>
                                                <p><strong>{model.topRisk.label}</strong> com {formatValue(model.topRisk.value)}. {getRiskBand(model.topRisk.value)}.</p>
                                                <button type="button" onClick={() => selectTab('risks')}>
                                                    Ver riscos<ArrowRight size={14} />
                                                </button>
                                            </section>

                                            <section className="viewAnalysis-rail-block">
                                                <h3>Perfil da reunião</h3>
                                                <p className="viewAnalysis-hint">Média por dimensão. Riscos e negatividade ficam de fora.</p>
                                                <EChart option={model.profile} height={250} ariaLabel="Gráfico: perfil da reunião por dimensão" />
                                            </section>

                                            <RankList title="Pontos fortes" items={model.ranking.strengths} />
                                            <RankList title="Pontos de atenção" items={model.ranking.attention} />
                                        </aside>
                                    </div>
                                </>
                            }

                            {isReady && (activeTab === 'meeting' || activeTab === 'business') && model &&
                                <div className="viewAnalysis-grid">
                                    {model.sections.filter(({ section }) => section.tab === activeTab).map(renderSection)}
                                </div>
                            }

                            {isReady && activeTab === 'risks' && model &&
                                <div className="viewAnalysis-grid">
                                    {model.sections.filter(({ section }) => section.tab === 'risks').map(renderSection)}
                                    <Panel
                                        title="Exposição média"
                                        description="Média dos quatro indicadores de risco."
                                        span={4}
                                    >
                                        <p className="viewAnalysis-exposure">
                                            <strong style={{ color: getRiskColor(model.exposure) }}>{formatValue(model.exposure)}</strong> / 100
                                        </p>
                                        <Bar value={model.exposure} color={getRiskColor(model.exposure)} />
                                        <p className="viewAnalysis-hint">{getRiskBand(model.exposure)}</p>
                                        <ul className="viewAnalysis-scale" aria-label="Escala de risco">
                                            {RISK_SCALE.map((band) => (
                                                <li key={band.range}>
                                                    <i style={{ background: band.color }} />
                                                    <span>{band.label}</span>
                                                    <em>{band.range}</em>
                                                </li>
                                            ))}
                                        </ul>
                                    </Panel>
                                </div>
                            }
                        </section>
                    </div>
                </section>
            </section>
        </main>
    )
}

const ViewAnalysis = () => {
    const { id } = useParams()
    return <ViewAnalysisContent key={id} />
}

export default ViewAnalysis