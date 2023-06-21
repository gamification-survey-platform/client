import * as d3 from 'd3'

const PROGRESS_LABELS = {
  0.0: "Let's get started now...",
  0.2: "You've got a ways to go.",
  0.5: "That's some progress.",
  0.6: 'Nice, getting closer!',
  0.8: 'Come on, almost there!',
  0.9: 'Last stretch!'
}

const getProgressLabel = (angle) => {
  const angles = Object.keys(PROGRESS_LABELS)
  const labels = Object.values(PROGRESS_LABELS)
  for (let i = 0; i < angles.length - 1; i++) {
    if (angles[i] <= angle && angle <= angles[i + 1]) return labels[i]
  }
  return labels[labels.length - 1]
}

const renderProgressBar = ({ data: { startPct, endPct }, ref, chartHeight, chartWidth }) => {
  const chart = d3.select(ref.current)
  chart.select('svg').remove()
  const startAngle = startPct * 2 * Math.PI
  const endAngle = endPct * 2 * Math.PI
  const svg = chart
    .append('svg')
    .attr('height', chartHeight)
    .attr('width', chartWidth)
    .append('g')
    .attr('transform', `translate(${chartWidth / 2}, ${chartHeight / 2})`)

  const margin = 40
  const outerRadius = Math.min(chartWidth, chartHeight) / 2 - margin
  const innerRadius = outerRadius - 20
  const backArc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(0)
    .endAngle(Math.PI * 2)

  svg.append('path').attr('d', backArc).attr('fill', '#ddd')

  const arcTween = (newAngle, arcGenerator) => (d) => {
    const customInterpolate = d3.interpolate(d.endAngle, newAngle)
    return (t) => {
      d.endAngle = customInterpolate(t)
      return arcGenerator(d)
    }
  }

  svg.append('text').text(getProgressLabel(endPct)).attr('text-anchor', 'middle')

  const frontArc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(0)
    .cornerRadius((outerRadius - innerRadius) / 2)

  const g = svg.append('path').attr('fill', '#38D2B3').datum({ endAngle: startAngle })
  g.transition().duration(1000).attrTween('d', arcTween(endAngle, frontArc))
}

export default renderProgressBar
