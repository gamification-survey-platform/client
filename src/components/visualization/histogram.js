import * as d3 from 'd3'

const formatData = (data) => {
  const counts = {}
  for (const i of data) {
    if (counts[i]) counts[i] += 1
    else counts[i] = 1
  }
  return Object.entries(counts)
}

const renderHistogram = ({ data: rawData, ref, chartHeight, chartWidth }) => {
  const data = formatData(rawData)
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
  const x = d3.scaleLinear().domain(d3.extent(rawData)).range([0, width])
  const y = d3.scaleLinear().domain(x.domain()).range([height, 0])
  const fills = d3.schemeCategory10
  const histogramData = d3
    .bin()
    .value((d) => d)
    .thresholds(10)
  const bins = histogramData(rawData)
  console.log(bins)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x))
  svg.append('g').attr('class', 'axis y-axis').call(d3.axisLeft(y))

  svg
    .append('text')
    .text('x axis')
    .attr(`transform`, `translate(${width / 2}, ${height + margin.bottom})`)
    .attr('text-anchor', 'center')
  svg
    .append('text')
    .text('y axis')
    .attr(`transform`, `translate(${-margin.left / 2}, ${height / 2})rotate(-90)`)
    .attr('text-anchor', 'center')
  svg
    .append('text')
    .text('Title')
    .attr(`transform`, `translate(${width / 2}, 0)`)
    .attr('text-anchor', 'center')
  /*
  svg
    .selectAll('.bar')
    .data(histogramData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => x(d[0]))
    .attr('y', height)
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .attr('fill', (d, i) => fills[i])
    .transition()
    .duration(3000)
    .ease(d3.easeCubicInOut)
    .attr('height', (d) => height - y(d[1]))
    .attr('y', (d) => y(d[1]))

  svg
    .selectAll('.bar')
    .on('mouseover', function (event, d) {
      const textLen = `${d[1]}`.length
      tooltip = svg
        .append('text')
        .text(`${d[1]}`)
        .attr(
          'transform',
          `translate(${x(d[0]) + x.bandwidth() / 2 - 5 * textLen}, ${y(d[1]) - 3})`
        )
    })
    .on('mouseout', () => tooltip.remove())
  */
}

export default renderHistogram
