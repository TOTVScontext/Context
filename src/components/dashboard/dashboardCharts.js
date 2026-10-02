import { SECTIONS, buildSectionOption } from '../analysis/analysisCharts'

export const INDICATORS = Object.fromEntries(
    SECTIONS.flatMap((section) =>
        Object.entries(section.labels).map(([key, label]) => [
            `${section.key}.${key}`,
            {
                label,
                dimension: section.short,
                inverted: Boolean(section.inverted || section.negativeKeys?.includes(key)),
            },
        ]),
    ),
)

export const formatWeek = (isoDate) => {
    const [, month, day] = isoDate.split('-')
    return `${day}/${month}`
}

function buildWeeklyOption(timeline, field) {
    const section = {
        key: 'weekly',
        type: 'bar-vertical',
        labels: Object.fromEntries(timeline.map((week) => [week.week_start, formatWeek(week.week_start)])),
    }
    const data = {
        weekly: Object.fromEntries(timeline.map((week) => [week.week_start, week[field]])),
    }
    return buildSectionOption(section, data)
}

export const buildWeeklyAverageOption = (timeline) => buildWeeklyOption(timeline, 'overall_average')
export const buildWeeklySuccessOption = (timeline) => buildWeeklyOption(timeline, 'success_rate')