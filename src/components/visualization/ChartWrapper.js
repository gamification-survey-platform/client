import { useEffect, useRef } from 'react'
import { mockBarChartData, mockPieChartData, mockStackedBarChartData } from '../../utils/mockData'
import barChart from './barChart'
import donutChart from './donutChart'
import stackedBarChart from './stackedBarChart'
import progressBar from './progressBar'
import wordcloud from './wordcloud'
import progressTriangle from './progressTriangle'
import histogram from './histogram'

const ChartWrapper = ({ data, type }) => {
  const ref = useRef()

  useEffect(() => {
    const drawChart = () => {
      if (ref && ref.current) {
        const { height: chartHeight, width: chartWidth } =
          ref.current.parentNode.getBoundingClientRect()
        if (type === 'bar') {
          barChart({ data: mockBarChartData, ref, chartHeight, chartWidth })
        } else if (type === 'donut') {
          donutChart({ data, ref, chartHeight, chartWidth })
        } else if (type === 'stackedBarChart') {
          stackedBarChart({ data, ref, chartHeight, chartWidth })
        } else if (type === 'progressBar') {
          progressBar({ data, ref, chartHeight, chartWidth })
        } else if (type === 'wordcloud') {
          wordcloud({ data, ref, chartHeight, chartWidth })
        } else if (type === 'progressTriangle') {
          progressTriangle({ data, ref, chartHeight, chartWidth })
        } else if (type === 'histogram') {
          histogram({ data, ref, chartHeight, chartWidth })
        }
      }
    }
    window.addEventListener('resize', drawChart)
    drawChart()
  }, [data, type, ref])

  return <div ref={ref} />
}

export default ChartWrapper
