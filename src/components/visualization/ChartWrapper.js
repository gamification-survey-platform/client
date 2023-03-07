import { useEffect, useRef } from 'react'
import { mockBarChartData } from '../../utils/mockData'
import barChart from './barChart'

const ChartWrapper = ({ data, type, height, width }) => {
  const ref = useRef()

  useEffect(() => {
    if (ref && ref.current) {
      if (type === 'bar') {
        barChart({ data: mockBarChartData, ref, height, width })
      }
    }
  }, [data, type, ref])
  return <div ref={ref} />
}

export default ChartWrapper
