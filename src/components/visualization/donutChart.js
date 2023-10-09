import * as d3 from 'd3'

const renderDonutChart = ({ data: chartData, ref, chartHeight, chartWidth }) => {
  const chart = d3.select(ref.current)
  chart.select('svg').remove()
  const margin = 40
  const outerRadius = Math.min(chartWidth, chartHeight) / 2 - margin
  const innerRadius = outerRadius - 50

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)
  const expandedArc = d3
    .arc()
    .innerRadius(innerRadius - 10)
    .outerRadius(outerRadius + 10)
  const svg = chart
    .append('svg')
    .attr('height', chartHeight)
    .attr('width', chartWidth)
    .append('g')
    .attr('transform', `translate(${chartWidth / 2}, ${chartHeight / 2})`)

  // svg.append('text').text(chartData.title).attr('text-anchor', 'middle')

  const pie = d3.pie().value((d) => d[1])
  const data = pie(Object.entries(chartData.data))
  const fills = d3.schemeCategory10
  svg
    .selectAll('.arc')
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('fill', (d, i) => fills[i])
    .style('opacity', 0.7)
    .transition()
    .duration(2000)
    .attrTween('d', function (d) {
      var i = d3.interpolate(d.startAngle + 0.1, d.endAngle)
      return function (t) {
        d.endAngle = i(t)
        return arc(d)
      }
    })
  let tooltip
  svg
    .selectAll('.arc')
    .on('mouseover', function (_, d) {
      const [xPos, yPos] = arc.centroid(d)
      tooltip = svg
        .append('text')
        .text(`${d.data[0]} - ${d.data[1]}`)
        .attr('transform', `translate(${xPos}, ${yPos})`)
        .attr('text-anchor', 'middle')
      d3.select(this).attr('d', expandedArc(d))
    })
    .on('mouseout', function (_, d) {
      d3.select(this).attr('d', arc(d))
      tooltip.remove()
    })
}

export default renderDonutChart
