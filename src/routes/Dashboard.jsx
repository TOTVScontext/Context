import '../css/dashboard.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowRight, ChartLine, Dashboard as DashboardIcon, Events, FileX, Information, Portfolio, Renew, WarningAlt } from '@carbon/icons-react'
import Aside from '../components/Aside'
import Header from '../components/Header'
import EChart from '../components/analysis/EChart'
import { useDashboard } from '../hooks/useDashboard'
import { GOAL_INFO, RISK_SCALE, SECTIONS, buildProfileOption, buildSectionOption, clamp, formatValue, getRiskBand, getRiskColor, getScoreBand, getTopRisk, hasAnyScore, readValue, sectionAverage } from '../components/analysis/analysisCharts'
import { INDICATORS, buildWeeklyAverageOption, buildWeeklySuccessOption, formatWeek } from '../components/dashboard/dashboardCharts'

const TABS = [
    { id: 'overview', label: 'Visão geral', icon: <DashboardIcon size={15} /> },
    { id: 'evolution', label: 'Evolução', icon: <ChartLine size={15} /> },
    { id: 'meeting', label: 'Reunião', icon: <Events size={15} /> },
    { id: 'business', label: 'Cliente e negócio', icon: <Portfolio size={15} /> },
    { id: 'risks', label: 'Riscos', icon: <WarningAlt size={15} /> },
]

const EMPTY_ANALYSIS_DATA = { averages: {}, goals: {}, timeline: [], total_analyses: 0 }
const MIN_RELIABLE_SAMPLE = 5
const MIN_RELIABLE_WEEKS = 3
const GENERATING_MESSAGE = 'Gerando a análise geral. Isso pode levar alguns instantes.'

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })
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

const formatWith = (formatter) => (isoString) => {
    const date = new Date(isoString)
    return Number.isNaN(date.getTime()) ? null : formatter.format(date)
}

const formatDateTime = formatWith(dateTimeFormatter)
const formatDate = formatWith(dateFormatter)

const signed = (value) => `${value > 0 ? '+' : ''}${formatValue(value)}`

const Bar = ({ value, color }) => (
    <div className="dashboard-bar">
        <span style={{ width: `${clamp(value)}%`, ...(color && { background: color }) }} />
    </div>
)

const Panel = ({ title, description, span, aside, children }) => (
    <article className={`dashboard-panel span-${span}`}>
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

const Notice = ({ tone, role = 'status', children }) => (
    <div className="dashboard-notice" data-tone={tone} role={role}>
        {tone === 'error' ? <WarningAlt size={18} /> : <Information size={18} />}
        <p>{children}</p>
    </div>
)

const RankList = ({ title, items }) => items.length > 0 && (
    <section className="dashboard-rail-block">
        <h3>{title}</h3>
        <ul className="dashboard-rank">
            {items.map((item) => (
                <li key={item.id}>
                    <div>
                        <span>{item.label}<em>{item.dimension}{item.inverted && ' · menor é melhor'}</em></span>
                        <strong>{formatValue(item.value)}</strong>
                    </div>
                    <Bar value={item.value} color={item.inverted ? getRiskColor(item.value) : undefined} />
                </li>
            ))}
        </ul>
    </section>
)

const Dashboard = () => {
    const {
        status, error, dashboard,
        generateStatus, generateMessage, isGenerating,
        fetchDashboard, generateDashboard,
    } = useDashboard()
    const [activeTab, setActiveTab] = useState('overview')
    const scrollRef = useRef(null)

    useEffect(() => {
        const controller = new AbortController()
        fetchDashboard({ signal: controller.signal })
        return () => controller.abort()
    }, [fetchDashboard])

    const analysisData = dashboard?.analysis_data
    const hasData = hasAnyScore(analysisData?.averages)
    const isEmpty = status === 'success' && !dashboard
    const showMetrics = hasData || isEmpty

    const model = useMemo(() => {
        if (!showMetrics) return null

        const source = hasData ? analysisData : EMPTY_ANALYSIS_DATA
        const { averages, goals, overall, highlights, timeline = [] } = source
        const riskSection = SECTIONS.find((section) => section.inverted)
        const toRankItems = (list = []) =>
            list.map(({ path, value }) => ({ id: path, value, ...INDICATORS[path] })).filter((item) => item.label)
        const previous = overall?.previous_average
        const hasPrevious = typeof previous === 'number'
        const delta = hasPrevious ? Number(overall.delta_points) || 0 : null

        return {
            isEmpty: !hasData,
            timeline,
            kpis: [
                {
                    key: 'overall_score',
                    label: 'Score geral médio',
                    unit: '/ 100',
                    value: readValue(averages, 'summary_scores', 'overall_score'),
                    description: 'Média do score geral das reuniões.',
                },
                {
                    key: 'client_health',
                    label: 'Saúde do cliente',
                    unit: '/ 100',
                    value: readValue(averages, 'summary_scores', 'client_health'),
                    description: 'Satisfação, confiança e aderência percebidas.',
                },
                {
                    key: 'deal_health',
                    label: 'Saúde dos negócios',
                    unit: '/ 100',
                    value: readValue(averages, 'summary_scores', 'deal_health'),
                    description: 'Avanço e viabilidade das oportunidades.',
                },
                {
                    key: 'goals',
                    label: 'Objetivos atendidos',
                    unit: '%',
                    value: Number(goals?.success?.rate) || 0,
                    description: hasData
                        ? `${goals?.success?.count ?? 0} de ${source.total_analyses} reuniões.`
                        : 'Sem reuniões consolidadas.',
                },
            ],
            variation: hasPrevious
                ? {
                    delta,
                    trend: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
                    detail: previous > 0
                        ? `Média anterior de ${formatValue(previous)}. Variação de ${signed(Number(overall.growth_rate) || 0)}%.`
                        : `Média anterior de ${formatValue(previous)}.`,
                }
                : null,
            goals: Object.keys(GOAL_INFO).map((key) => ({
                key,
                ...GOAL_INFO[key],
                count: goals?.[key]?.count ?? 0,
                rate: goals?.[key]?.rate ?? 0,
            })),
            references: [
                { id: 'best', label: 'Melhor avaliada', meeting: source.best_meeting },
                { id: 'worst', label: 'Pior avaliada', meeting: source.worst_meeting },
            ].filter((item) => item.meeting),
            profile: buildProfileOption(averages),
            topRisk: getTopRisk(averages),
            exposure: sectionAverage(riskSection, averages),
            strengths: toRankItems(highlights?.strengths),
            attention: toRankItems(highlights?.weaknesses),
            weeklyAverage: buildWeeklyAverageOption(timeline),
            weeklySuccess: buildWeeklySuccessOption(timeline),
            sections: SECTIONS.map((section) => ({
                section,
                option: buildSectionOption(section, averages),
                average: sectionAverage(section, averages),
            })),
        }
    }, [showMetrics, hasData, analysisData])

    const isPending = status === 'idle' || status === 'loading'
    const isError = status === 'error'
    const isReady = status === 'success'
    const hasSnapshot = isReady && Boolean(dashboard)
    const tabs = showMetrics ? TABS : []
    const period = analysisData?.period
    const periodLabel = period && `${formatDate(period.from) ?? '—'} a ${formatDate(period.to) ?? '—'}`
    const excluded = analysisData?.excluded_without_scores ?? 0
    const generationMessage = isGenerating ? GENERATING_MESSAGE : generateMessage

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
        document.getElementById(`dashboard-tab-${tabs[next].id}`)?.focus()
    }

    const renderSection = ({ section, option, average }) => (
        <Panel
            key={section.key}
            title={section.title}
            description={section.description}
            span={section.span}
            aside={<span className="dashboard-average">Média <strong>{formatValue(average)}</strong></span>}
        >
            <EChart
                option={option}
                height={section.type === 'radar' ? 290 : 230}
                ariaLabel={`Gráfico: ${section.title} (média geral)`}
            />
        </Panel>
    )

    const emptyReport = (
        <article className="dashboard-report">
            <h2>Relatório executivo</h2>
            <div className="dashboard-report-empty">
                <DashboardIcon size={32} />
                <h3>Nenhuma análise geral disponível</h3>
                <p>Depois de analisar transcrições, gere a análise geral para consolidar o desempenho. Ela também é atualizada automaticamente toda semana.</p>
            </div>
        </article>
    )

    const report = dashboard?.analysis && (
        <article className="dashboard-report">
            <h2>Relatório executivo</h2>
            <div className="markdown-content">
                <ReactMarkdown remarkPlugins={remarkPlugins} components={markdownComponents}>
                    {dashboard.analysis}
                </ReactMarkdown>
            </div>
        </article>
    )

    return (
        <main className="dashboard-main">
            <Aside />
            <section className="content-main">
                <Header />
                <section className="dashboard-content" ref={scrollRef}>
                    <div className="dashboard-top">
                        <header className="dashboard-header">
                            <div className='dashboard-header-title'>
                                <h1>Dashboard</h1>
                                <p>Acompanhe o desempenho geral das suas análises</p>
                            </div>
                            <div className="dashboard-header-side">
                                {hasSnapshot &&
                                    <dl className="dashboard-meta">
                                        {formatDateTime(dashboard.created_at) &&
                                            <div><dt>Atualizada em</dt><dd>{formatDateTime(dashboard.created_at)}</dd></div>}
                                        <div><dt>Análises</dt><dd>{dashboard.total_analyses}</dd></div>
                                        {periodLabel && <div><dt>Período</dt><dd>{periodLabel}</dd></div>}
                                    </dl>
                                }
                                {isReady &&
                                    <button type="button" className="dashboard-action" onClick={generateDashboard} disabled={isGenerating}>
                                        <Renew size={16} className={isGenerating ? 'spinning' : undefined} />
                                        {isGenerating ? 'Gerando análise' : dashboard ? 'Atualizar análise' : 'Gerar análise'}
                                    </button>
                                }
                            </div>
                        </header>

                        {isPending && <div className="dashboard-tabs-skeleton skeleton" />}

                        {isReady && tabs.length > 0 &&
                            <div className="dashboard-tabs" role="tablist" aria-label="Seções do dashboard" onKeyDown={handleTabKeyDown}>
                                {tabs.map(({ id: tabId, label, icon }) => (
                                    <button
                                        key={tabId}
                                        id={`dashboard-tab-${tabId}`}
                                        role="tab"
                                        type="button"
                                        aria-selected={activeTab === tabId}
                                        aria-controls="dashboard-panel"
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

                    <div className="dashboard-scroll">
                        {generationMessage &&
                            <Notice tone={generateStatus} role={generateStatus === 'error' ? 'alert' : 'status'}>
                                {generationMessage}
                            </Notice>
                        }

                        <section
                            id="dashboard-panel"
                            role={isReady && tabs.length > 0 ? 'tabpanel' : undefined}
                            aria-labelledby={isReady && tabs.length > 0 ? `dashboard-tab-${activeTab}` : undefined}
                            className="dashboard-body"
                        >
                            {isPending &&
                                <div className="dashboard-grid">
                                    <div className="dashboard-skeleton skeleton span-12" />
                                    <div className="dashboard-skeleton skeleton tall span-8" />
                                    <div className="dashboard-skeleton skeleton tall span-4" />
                                </div>
                            }

                            {isError &&
                                <article className="dashboard-empty">
                                    <FileX size={32} />
                                    <h2>Não foi possível carregar o dashboard</h2>
                                    <p>{error}</p>
                                    <button type="button" className="dashboard-action" onClick={() => fetchDashboard({ force: true })}>
                                        Tentar novamente
                                    </button>
                                </article>
                            }

                            {hasSnapshot && !hasData &&
                                <>
                                    <Notice tone="warning">
                                        <strong>Métricas indisponíveis.</strong> Não foi possível consolidar os indicadores quantitativos. O relatório executivo está disponível abaixo.
                                    </Notice>
                                    {report}
                                </>
                            }

                            {isReady && model && !model.isEmpty &&
                                <>
                                    {excluded > 0 &&
                                        <Notice tone="warning">
                                            <strong>{excluded} {excluded === 1 ? 'análise ficou fora' : 'análises ficaram fora'} do cálculo.</strong> {excluded === 1 ? 'Ela não possui' : 'Elas não possuem'} métricas utilizáveis.
                                        </Notice>
                                    }
                                    {analysisData.total_analyses < MIN_RELIABLE_SAMPLE &&
                                        <Notice tone="warning">
                                            <strong>Amostra reduzida.</strong> Com menos de {MIN_RELIABLE_SAMPLE} análises, médias e tendências são pouco conclusivas.
                                        </Notice>
                                    }
                                </>
                            }

                            {isReady && activeTab === 'overview' && model &&
                                <>
                                    <div className="dashboard-kpis">
                                        {model.kpis.map((kpi) => (
                                            <div key={kpi.key} className="dashboard-kpi">
                                                <span>{kpi.label}</span>
                                                <p><strong>{formatValue(kpi.value)}</strong> {kpi.unit}</p>
                                                <Bar value={kpi.value} />
                                                <small><b>{model.isEmpty ? 'Sem dados' : getScoreBand(kpi.value)}.</b> {kpi.description}</small>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="dashboard-overview">
                                        <div className="dashboard-overview-main">
                                            {model.isEmpty ? emptyReport : report ?? <p className="dashboard-muted">Esta análise geral não tem relatório textual.</p>}
                                        </div>

                                        <aside className="dashboard-rail" aria-label="Leitura rápida">
                                            <section className="dashboard-rail-block">
                                                <h3>Variação da média geral</h3>
                                                {model.variation
                                                    ? <>
                                                        <p className="dashboard-delta" data-trend={model.variation.trend}>
                                                            {signed(model.variation.delta)} pts
                                                        </p>
                                                        <p className="dashboard-hint">{model.variation.detail}</p>
                                                    </>
                                                    : <p className="dashboard-hint">{model.isEmpty ? 'Sem dados para comparação.' : 'Primeira análise consolidada. Ainda não há base de comparação.'}</p>
                                                }
                                            </section>

                                            <section className="dashboard-rail-block">
                                                <h3>Objetivos das reuniões</h3>
                                                <ul className="dashboard-goals">
                                                    {model.goals.map((goal) => (
                                                        <li key={goal.key} data-goal={goal.key}>
                                                            <div>
                                                                <span className="dashboard-tag" data-goal={goal.key}><i />{goal.label}</span>
                                                                <strong>{goal.count} · {formatValue(goal.rate)}%</strong>
                                                            </div>
                                                            <Bar value={goal.rate} />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>

                                            <section className="dashboard-rail-block dashboard-toprisk" style={model.isEmpty ? undefined : { '--risk': getRiskColor(model.topRisk.value) }}>
                                                <h3>Maior risco</h3>
                                                {model.isEmpty
                                                    ? <p>Sem dados de risco.</p>
                                                    : <p><strong>{model.topRisk.label}</strong> com média {formatValue(model.topRisk.value)}. {getRiskBand(model.topRisk.value)}.</p>
                                                }
                                                <button type="button" onClick={() => selectTab('risks')}>
                                                    Ver riscos<ArrowRight size={14} />
                                                </button>
                                            </section>

                                            <section className="dashboard-rail-block">
                                                <h3>Perfil geral</h3>
                                                <p className="dashboard-hint">Média por dimensão. Riscos e negatividade ficam de fora.</p>
                                                <EChart option={model.profile} height={250} ariaLabel="Gráfico: perfil geral por dimensão" />
                                            </section>

                                            <RankList title="Pontos fortes" items={model.strengths} />
                                            <RankList title="Pontos de atenção" items={model.attention} />

                                            {model.references.length > 0 &&
                                                <section className="dashboard-rail-block">
                                                    <h3>Reuniões de referência</h3>
                                                    <ul className="dashboard-references">
                                                        {model.references.map(({ id, label, meeting }) => (
                                                            <li key={id}>
                                                                <span>{label}</span>
                                                                <strong>{stripExtension(meeting.title) || 'Sem título'}</strong>
                                                                <p>
                                                                    Score {formatValue(meeting.overall_score)}
                                                                    {formatDate(meeting.created_at) && ` · ${formatDate(meeting.created_at)}`}
                                                                </p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </section>
                                            }
                                        </aside>
                                    </div>
                                </>
                            }

                            {isReady && activeTab === 'evolution' && model &&
                                <>
                                    {!model.isEmpty && model.timeline.length < MIN_RELIABLE_WEEKS &&
                                        <Notice tone="warning">
                                            <strong>Poucas semanas com dados.</strong> Com menos de {MIN_RELIABLE_WEEKS} semanas, evite conclusões de tendência.
                                        </Notice>
                                    }
                                    <div className="dashboard-grid">
                                        <Panel
                                            title="Média geral por semana"
                                            description="Score geral médio das reuniões de cada semana, nas últimas 12 semanas com dados."
                                            span={6}
                                        >
                                            <EChart option={model.weeklyAverage} height={260} ariaLabel="Gráfico: média geral por semana" />
                                        </Panel>
                                        <Panel
                                            title="Objetivos atendidos por semana"
                                            description="Percentual de reuniões com objetivo atendido em cada semana."
                                            span={6}
                                        >
                                            <EChart option={model.weeklySuccess} height={260} ariaLabel="Gráfico: objetivos atendidos por semana" />
                                        </Panel>
                                        <Panel
                                            title="Detalhamento semanal"
                                            description="Semanas iniciadas na segunda-feira, da mais recente para a mais antiga."
                                            span={12}
                                        >
                                            <div className="dashboard-table-wrapper">
                                                <table className="dashboard-table" aria-label="Detalhamento semanal">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Semana de</th>
                                                            <th scope="col">Reuniões</th>
                                                            <th scope="col">Média geral</th>
                                                            <th scope="col">Objetivos atendidos</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {model.timeline.length === 0 &&
                                                            <tr><td colSpan={4}>Nenhuma semana com dados.</td></tr>
                                                        }
                                                        {[...model.timeline].reverse().map((week) => (
                                                            <tr key={week.week_start}>
                                                                <th scope="row">{formatWeek(week.week_start)}</th>
                                                                <td>{week.meetings}</td>
                                                                <td>{formatValue(week.overall_average)}</td>
                                                                <td>{formatValue(week.success_rate)}%</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Panel>
                                    </div>
                                </>
                            }

                            {isReady && (activeTab === 'meeting' || activeTab === 'business') && model &&
                                <div className="dashboard-grid">
                                    {model.sections.filter(({ section }) => section.tab === activeTab).map(renderSection)}
                                </div>
                            }

                            {isReady && activeTab === 'risks' && model &&
                                <div className="dashboard-grid">
                                    {model.sections.filter(({ section }) => section.tab === 'risks').map(renderSection)}
                                    <Panel
                                        title="Exposição média"
                                        description="Média dos quatro indicadores de risco."
                                        span={4}
                                    >
                                        <p className="dashboard-exposure">
                                            <strong style={model.isEmpty ? undefined : { color: getRiskColor(model.exposure) }}>{formatValue(model.exposure)}</strong> / 100
                                        </p>
                                        <Bar value={model.exposure} color={model.isEmpty ? undefined : getRiskColor(model.exposure)} />
                                        <p className="dashboard-hint">{model.isEmpty ? 'Sem dados' : getRiskBand(model.exposure)}</p>
                                        <ul className="dashboard-scale" aria-label="Escala de risco">
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

export default Dashboard