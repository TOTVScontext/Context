import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BarChart, RadarChart } from 'echarts/charts'
import { GridComponent, RadarComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, RadarChart, GridComponent, RadarComponent, TooltipComponent, CanvasRenderer])

const EChart = ({ option, height = 260, ariaLabel }) => {
    const containerRef = useRef(null)
    const chartRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        const chart = echarts.init(container, null, { renderer: 'canvas' })
        chartRef.current = chart

        let frame = 0
        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => chart.resize())
        })
        observer.observe(container)

        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
            chart.dispose()
            chartRef.current = null
        }
    }, [])

    useEffect(() => {
        chartRef.current?.setOption(option, true)
    }, [option])

    return (
        <div
            ref={containerRef}
            className="viewAnalysis-echart"
            style={{ height }}
            role="img"
            aria-label={ariaLabel}
        />
    )
}

export default EChart