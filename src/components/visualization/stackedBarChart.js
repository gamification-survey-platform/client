import * as d3 from 'd3'

const formatData = (rawData) => {
  const { labels, data: d } = rawData
  const data = Object.entries(d).map((entry) => {
    const [group, values] = entry
    const o = { group }
    values.forEach((v, j) => {
      o[labels[j]] = v
    })
    return o
  })
  return { labels, data }
}

const renderStackedBarChart = ({ data: rawData, ref, chartHeight, chartWidth }) => {
  const chart = d3.select(ref.current)
  chart.select('svg').remove()
  const margin = {
    top: 30,
    bottom: 40,
    left: 400,
    right: 30
  }
  const { labels, data } = formatData(rawData)
  const height = chartHeight - margin.top - margin.bottom
  const width = chartWidth - margin.left - margin.right
  const svg = chart
    .append('svg')
    .attr('height', chartHeight)
    .attr('width', chartWidth)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const groups = d3.map(data, (d) => d.group)

  const stackedData = d3.stack().keys(labels)(data)
  let max = 0
  stackedData.forEach((d) =>
    d.forEach((i) => {
      max = Math.max(max, i[1])
    })
  )

  const color = d3
    .scaleLinear()
    .domain([0, labels.length / 2, labels.length])
    .range(['#ec3023', '#fdea45', '#15793f'])
  const x = d3
    .scaleLinear()
    .domain([0, max + 2])
    .range([0, width])
  const y = d3.scaleBand().domain(groups).range([0, height]).padding([0.2])

  const yAxis = svg.append('g').call(d3.axisLeft(y))

  yAxis.selectAll('text').each(function (text) {
    const element = d3.select(this)
    const words = text.split(/\s+/)
    const lines = []
    words.forEach((w, i) => {
      if (i % 10 === 0) lines.push(`${w}`)
      else lines[lines.length - 1] += ` ${w}`
    })
    let dy = parseFloat(element.attr('dy'))
    element.text(null).attr('dy', dy - lines.length * 2)
    lines.forEach((l, i) => {
      element
        .append('tspan')
        .text(l)
        .attr('x', 0)
        .attr('dx', '-1em')
        .attr('dy', i === 0 ? 0 - lines.length / 2 + 1 + 'em' : '1em')
    })
  })

  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).tickSizeOuter(0))

  svg
    .append('g')
    .selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('fill', (d, i) => color(i))
    .attr('class', 'label')
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d[0]))
    .attr('y', (d) => y(d.data.group))
    .attr('width', (d) => x(d[1]) - x(d[0]))
    .attr('height', y.bandwidth())
  let tooltip
  svg.selectAll('.label').on('mouseover', function (_, d) {
    tooltip = svg
      .append('text')
      .text(d.key)
      .attr('x', x(d[0][0]) + 5)
      .attr('y', 0)
  })
  svg.selectAll('.label').on('mouseout', () => tooltip.remove())
}

export default renderStackedBarChart
