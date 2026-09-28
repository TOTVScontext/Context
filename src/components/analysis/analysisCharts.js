const FONT = 'Poppins, sans-serif'

export const PALETTE = {
    gold: '#f5c528',
    goldSoft: '#f5c52824',
    ink: '#161616',
    text: '#525252',
    helper: '#8d8d8d',
    grid: '#e8e8e8',
    track: '#f0f0f0',
    good: '#198038',
    warn: '#ff832b',
    bad: '#da1e28',
}

const REDUCED = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const BASE = {
    animation: !REDUCED,
    animationDuration: 400,
    animationEasing: 'cubicOut',
    textStyle: { fontFamily: FONT },
}

const TOOLTIP = {
    backgroundColor: '#ffffff',
    borderColor: '#d0d0d0',
    borderWidth: 1,
    padding: [6, 10],
    extraCssText: 'box-shadow:none;border-radius:3px;',
    textStyle: { fontFamily: FONT, fontSize: 11, color: PALETTE.ink },
}

const numberFormat = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
export const formatValue = (value) => numberFormat.format(Number(value) || 0)
export const clamp = (value) => Math.min(100, Math.max(0, Number(value) || 0))

export const SUMMARY_SECTION = {
    key: 'summary_scores',
    labels: {
        overall_score: 'Score geral',
        client_health: 'Saúde do cliente',
        deal_health: 'Saúde do negócio',
    },
    descriptions: {
        overall_score: 'Avaliação consolidada da reunião.',
        client_health: 'Satisfação, confiança e aderência percebidas.',
        deal_health: 'Avanço e viabilidade da oportunidade.',
        goal_achievement: 'Quanto do objetivo da reunião foi cumprido.',
    },
}

export const GOAL_INFO = {
    success: { label: 'Atendido', description: 'Objetivo claramente cumprido.' },
    partial: { label: 'Parcial', description: 'Objetivo parcialmente cumprido ou com resultado misto.' },
    fail: { label: 'Não atendido', description: 'Objetivo não cumprido ou reunião sem avanço relevante.' },
}

export const RISK_SCALE = [
    { range: '0 a 20', label: 'Muito baixo', color: PALETTE.good },
    { range: '21 a 40', label: 'Baixo', color: PALETTE.good },
    { range: '41 a 60', label: 'Moderado', color: PALETTE.warn },
    { range: '61 a 80', label: 'Alto', color: PALETTE.bad },
    { range: '81 a 100', label: 'Crítico', color: PALETTE.bad },
]

export const SECTIONS = [
    {
        key: 'meeting_analysis', tab: 'meeting', short: 'Reunião', title: 'Desempenho da reunião',
        description: 'Eficácia, produtividade e qualidade das decisões tomadas.', type: 'radar', span: 6,
        labels: { effectiveness: 'Eficácia', productivity: 'Produtividade', goal_achievement: 'Objetivo atingido', decision_quality: 'Qualidade das decisões' },
    },
    {
        key: 'communication', tab: 'meeting', short: 'Comunicação', title: 'Comunicação',
        description: 'Clareza, persuasão e condução da conversa.', type: 'radar', span: 6,
        labels: { clarity: 'Clareza', objectivity: 'Objetividade', persuasion: 'Persuasão', active_listening: 'Escuta ativa', objection_handling: 'Objeções' },
    },
    {
        key: 'engagement', tab: 'meeting', short: 'Engajamento', title: 'Engajamento',
        description: 'Nível de participação e atenção dos envolvidos.', type: 'bar-horizontal', span: 6,
        labels: { overall: 'Geral', participation: 'Participação', interaction: 'Interação', attention: 'Atenção' },
    },
    {
        key: 'execution', tab: 'meeting', short: 'Execução', title: 'Execução',
        description: 'Gestão do tempo, aderência à pauta e encaminhamentos.', type: 'bar-horizontal', span: 6,
        labels: { time_management: 'Gestão do tempo', agenda_adherence: 'Aderência à pauta', next_steps_clarity: 'Clareza dos próximos passos', follow_up_quality: 'Qualidade do follow-up' },
    },
    {
        key: 'customer', tab: 'business', short: 'Cliente', title: 'Percepção do cliente',
        description: 'Como o cliente enxerga a conversa e a solução.', type: 'radar', span: 6,
        labels: { satisfaction: 'Satisfação', trust: 'Confiança', engagement_level: 'Engajamento', pain_understanding: 'Entendimento da dor', solution_fit: 'Aderência da solução' },
    },
    {
        key: 'sentiment', tab: 'business', short: 'Sentimento', title: 'Sentimento',
        description: 'Tom emocional do cliente e da equipe ao longo da conversa.', type: 'bar-vertical', span: 6,
        labels: { client: 'Cliente', team: 'Equipe', positivity: 'Positividade', negativity: 'Negatividade' },
        negativeKeys: ['negativity'],
    },
    {
        key: 'business', tab: 'business', short: 'Negócio', title: 'Progresso comercial',
        description: 'Avanço do negócio, valor percebido e urgência.', type: 'bar-horizontal', span: 6,
        labels: { deal_progress: 'Progresso do negócio', conversion_likelihood: 'Prob. de conversão', perceived_value: 'Valor percebido', expected_value: 'Valor esperado', urgency: 'Urgência' },
    },
    {
        key: 'intelligence', tab: 'business', short: 'Inteligência', title: 'Inteligência comercial',
        description: 'Sinais de compra, alinhamento e momentum de decisão.', type: 'bar-horizontal', span: 6,
        labels: { alignment: 'Alinhamento', buying_signal: 'Sinal de compra', decision_momentum: 'Momentum de decisão', stakeholder_influence: 'Influência dos stakeholders' },
    },
    {
        key: 'risk', tab: 'risks', short: 'Risco', title: 'Riscos identificados',
        description: 'Ordenados do maior para o menor. Quanto maior o valor, maior o risco.', type: 'bar-horizontal', span: 8,
        inverted: true, sorted: true,
        labels: { churn: 'Churn', deal_loss: 'Perda do negócio', objection: 'Objeção', disengagement: 'Desengajamento' },
    },
]

export function readValue(data, section, key) {
    const value = Number(data?.[section]?.[key])
    return Number.isFinite(value) ? value : 0
}

export function hasAnyScore(data) {
    if (!data || typeof data !== 'object') return false
    return Object.values(data).some((section) =>
        section && typeof section === 'object' && Object.values(section).some((v) => Number(v) > 0),
    )
}

export function getScoreBand(value) {
    if (value <= 20) return 'Muito baixo'
    if (value <= 40) return 'Baixo'
    if (value <= 60) return 'Médio'
    if (value <= 80) return 'Bom'
    return 'Excelente'
}

export function getRiskBand(value) {
    if (value <= 20) return 'Risco muito baixo'
    if (value <= 40) return 'Risco baixo'
    if (value <= 60) return 'Risco moderado'
    if (value <= 80) return 'Risco alto'
    return 'Risco crítico'
}

export function getRiskColor(value) {
    if (value <= 40) return PALETTE.good
    if (value <= 60) return PALETTE.warn
    return PALETTE.bad
}

function entriesOf(section, data, { skipNegative = false } = {}) {
    const negative = new Set(skipNegative ? (section.negativeKeys ?? []) : [])
    return Object.entries(section.labels)
        .filter(([key]) => !negative.has(key))
        .map(([key, label]) => ({ key, label, value: readValue(data, section.key, key) }))
}

export function sectionAverage(section, data) {
    const items = entriesOf(section, data, { skipNegative: true })
    if (items.length === 0) return 0
    return items.reduce((sum, item) => sum + item.value, 0) / items.length
}

export function rankIndicators(data, size = 3) {
    const items = SECTIONS
        .filter((section) => !section.inverted)
        .flatMap((section) =>
            entriesOf(section, data, { skipNegative: true }).map((item) => ({
                ...item,
                id: `${section.key}.${item.key}`,
                dimension: section.short,
            })),
        )
    const sorted = [...items].sort((a, b) => b.value - a.value)
    return { strengths: sorted.slice(0, size), attention: sorted.slice(-size).reverse() }
}

export function getTopRisk(data) {
    const risk = SECTIONS.find((section) => section.inverted)
    return entriesOf(risk, data).reduce((top, item) => (item.value > top.value ? item : top))
}

const tooltipFormatter = (params) =>
    `${params.name}<br/><b>${formatValue(params.value)}</b> <span style="color:${PALETTE.helper}">/ 100</span>`

function radarOption({ names, values, seriesName }) {
    return {
        ...BASE,
        tooltip: {
            ...TOOLTIP,
            trigger: 'item',
            formatter: () => names.map((name, i) => `${name}: <b>${formatValue(values[i])}</b>`).join('<br/>'),
        },
        radar: {
            center: ['50%', '54%'],
            radius: '62%',
            shape: 'polygon',
            splitNumber: 4,
            indicator: names.map((name) => ({ name, max: 100 })),
            axisName: { color: PALETTE.text, fontSize: 10.5, fontFamily: FONT },
            axisNameGap: 8,
            splitArea: { show: false },
            splitLine: { lineStyle: { color: PALETTE.grid } },
            axisLine: { lineStyle: { color: PALETTE.grid } },
        },
        series: [
            {
                type: 'radar',
                symbol: 'rect',
                symbolSize: 5,
                lineStyle: { color: PALETTE.gold, width: 1.5 },
                itemStyle: { color: PALETTE.gold },
                areaStyle: { color: PALETTE.goldSoft },
                emphasis: { lineStyle: { width: 2 } },
                data: [{ value: values, name: seriesName }],
            },
        ],
    }
}

export function buildProfileOption(data) {
    const dimensions = SECTIONS.filter((section) => !section.inverted)
    return radarOption({
        names: dimensions.map((section) => section.short),
        values: dimensions.map((section) => sectionAverage(section, data)),
        seriesName: 'Perfil da reunião',
    })
}

function buildRadarOption(section, data) {
    const items = entriesOf(section, data)
    return radarOption({
        names: items.map((item) => item.label),
        values: items.map((item) => item.value),
        seriesName: section.title,
    })
}

function buildHorizontalBarOption(section, data) {
    const items = entriesOf(section, data)
    if (section.sorted) items.sort((a, b) => b.value - a.value)
    const colorFor = section.inverted ? getRiskColor : () => PALETTE.gold

    return {
        ...BASE,
        grid: { left: 0, right: 44, top: 4, bottom: 4, containLabel: true },
        tooltip: { ...TOOLTIP, trigger: 'item', formatter: tooltipFormatter },
        xAxis: { type: 'value', min: 0, max: 100, show: false },
        yAxis: {
            type: 'category',
            inverse: true,
            data: items.map((item) => item.label),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: PALETTE.text, fontSize: 11, fontFamily: FONT, margin: 14 },
        },
        series: [
            {
                type: 'bar',
                barWidth: 8,
                showBackground: true,
                backgroundStyle: { color: PALETTE.track, borderRadius: 3 },
                itemStyle: { borderRadius: 3 },
                label: {
                    show: true,
                    position: 'right',
                    color: PALETTE.ink,
                    fontSize: 11,
                    fontFamily: FONT,
                    formatter: ({ value }) => formatValue(value),
                },
                data: items.map((item) => ({ value: item.value, itemStyle: { color: colorFor(item.value) } })),
            },
        ],
    }
}

function buildVerticalBarOption(section, data) {
    const items = entriesOf(section, data)
    const negative = new Set(section.negativeKeys ?? [])

    return {
        ...BASE,
        grid: { left: 0, right: 8, top: 24, bottom: 4, containLabel: true },
        tooltip: { ...TOOLTIP, trigger: 'item', formatter: tooltipFormatter },
        xAxis: {
            type: 'category',
            data: items.map((item) => item.label),
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#c6c6c6' } },
            axisLabel: { color: PALETTE.text, fontSize: 11, fontFamily: FONT, margin: 12 },
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            interval: 25,
            axisLabel: { color: PALETTE.helper, fontSize: 10, fontFamily: FONT },
            splitLine: { lineStyle: { color: PALETTE.grid } },
        },
        series: [
            {
                type: 'bar',
                barWidth: 24,
                itemStyle: { borderRadius: [3, 3, 0, 0] },
                label: {
                    show: true,
                    position: 'top',
                    color: PALETTE.ink,
                    fontSize: 11,
                    fontFamily: FONT,
                    formatter: ({ value }) => formatValue(value),
                },
                data: items.map((item) => ({
                    value: item.value,
                    itemStyle: { color: negative.has(item.key) ? PALETTE.bad : PALETTE.gold },
                })),
            },
        ],
    }
}

export function buildSectionOption(section, data) {
    switch (section.type) {
        case 'radar':
            return buildRadarOption(section, data)
        case 'bar-vertical':
            return buildVerticalBarOption(section, data)
        default:
            return buildHorizontalBarOption(section, data)
    }
}