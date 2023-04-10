import * as d3 from 'd3'

const renderProgressTriangle = ({ data: { pct }, ref, chartHeight, chartWidth }) => {
  const chart = d3.select(ref.current)
  chart.select('svg').remove()
  const svg = chart.append('svg').attr('height', chartHeight).attr('width', chartWidth).append('g')
  const data = []
  const widthScale = d3.scaleLinear().domain([0, chartHeight]).range([0, chartWidth])
  const xScale = d3
    .scaleLinear()
    .domain([0, chartHeight])
    .range([chartWidth / 2, 0])

  const colorScale = d3.scaleLinear().domain([0, chartHeight]).range(['red', 'gray'])
  const fillScale = d3.scaleLinear().domain([chartHeight, 0]).range([0, 1])

  for (let i = 0; i < chartHeight; i++) {
    const d = { y: i, width: widthScale(i), x: xScale(i), height: 1 }
    data.push(d)
  }
  const path = d3.path()
  path.moveTo(chartWidth / 2, 0)
  path.lineTo(chartWidth, chartHeight)
  path.lineTo(0, chartHeight)
  path.closePath()
  svg.append('path').attr('d', path).style('stroke', 'white').style('stroke-width', 2)
  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width', (d) => d.width)
    .attr('height', (d) => d.height)
    .attr('y', (d) => d.y)
    .attr('x', (d) => d.x)
    .attr('fill', (d) => {
      const shouldBeFilled = fillScale(d.y) < pct
      return shouldBeFilled ? colorScale(d.y) : 'black'
    })
}

export default renderProgressTriangle
