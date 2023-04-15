import * as d3 from 'd3'

const renderHistogram = ({ data: rawData, ref, chartHeight, chartWidth }) => {
  const chart = d3.select(ref.current)
  chart.select('svg').remove()
  const margin = {
    top: 30,
    bottom: 40,
    left: 50,
    right: 30
  }
  const height = chartHeight - margin.top - margin.bottom
  const width = chartWidth - margin.left - margin.right
  const svg = chart
    .append('svg')
    .attr('height', chartHeight)
    .attr('width', chartWidth)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  let tooltip
  const x = d3
    .scaleLinear()
    .domain([d3.min(rawData) - 5, d3.max(rawData) + 5])
    .range([0, width])
  const y = d3.scaleLinear().range([height, 0])

  const fills = d3.scaleLinear().domain([0, 50, 100]).range(['#ec3023', '#fdea45', '#15793f'])

  const histogramData = d3
    .bin()
    .value((d) => d)
    .thresholds(10)
  const bins = histogramData(rawData)
  y.domain([0, d3.max(bins, (d) => d.length) + 3])

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x))

  svg.append('g').attr('class', 'axis y-axis').call(d3.axisLeft(y))

  svg
    .append('text')
    .text('Score')
    .attr(`transform`, `translate(${width / 2}, ${height + margin.bottom})`)
    .attr('text-anchor', 'center')
  svg
    .append('text')
    .text('Count')
    .attr(`transform`, `translate(${-margin.left / 2}, ${height / 2})rotate(-90)`)
    .attr('text-anchor', 'center')
  svg
    .append('text')
    .text('Score Distribution')
    .attr(`transform`, `translate(${width / 2}, 0)`)
    .attr('text-anchor', 'center')

  svg
    .selectAll('.rect')
    .data(bins)
    .enter()
    .append('rect')
    .attr('class', 'rect')
    .attr('x', (d) => 1 + x(d.x0))
    .attr('width', (d) => x(d.x1) - x(d.x0) - 1)
    .attr('height', 0)
    .attr('fill', (d, i) => fills(d[0]))
    .attr('y', (d) => height)
    .transition()
    .duration(3000)
    .ease(d3.easeCubicInOut)
    .attr('height', (d) => height - y(d.length))
    .attr('y', (d) => y(d.length))

  svg
    .selectAll('.rect')
    .on('mouseover', function (event, d) {
      tooltip = svg
        .append('text')
        .text(`${d.length}`)
        .attr('transform', `translate(${(x(d.x0) + x(d.x1)) / 2 - 5}, ${y(d.length) - 5})`)
    })
    .on('mouseout', () => tooltip.remove())
}

export default renderHistogram
