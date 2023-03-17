import * as d3 from 'd3'
import cloud from './d3.layout.cloud'

const renderCloud = ({ data: rawData, ref, chartHeight, chartWidth }) => {
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

  const data = Object.entries(rawData).map((d) => ({ text: d[0], frequency: d[1] }))
  const maxFrequency = d3.max(data.map((d) => d.frequency) + 10)
  const minFrequency = d3.min(data.map((d) => d.frequency))

  const size = d3.scaleLinear().domain([minFrequency, maxFrequency]).range([10, 100])

  const color = d3.scaleOrdinal().domain(data).range(d3.schemeCategory10)

  const layout = cloud()
    .size([chartWidth, chartHeight])
    .words(
      data.map((d) => {
        return { text: d.text, size: size(d.frequency) }
      })
    )
    .padding(2)
    .rotate(() => Math.floor(Math.random() * 90) - 45)
    .font('Impact')
    .fontSize((d) => d.size)
    .on('end', draw)

  layout.start()

  function draw(data) {
    svg
      .attr('width', layout.size()[0])
      .attr('height', layout.size()[1])
      .attr('class', 'wordcloud')
      .append('g')
      .attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .style('font-size', (d) => d.size + 'px')
      .style('fill', (d, i) => color(i))
      .style('cursor', 'pointer')
      .attr('text-anchor', 'middle')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
      .text((d) => d.text)
      .on('mouseover', function (d, i) {
        d3.select(this)
          .style('fill', '#377DB8')
          .style('font-size', (d) => d.size * 1.5 + 'px')
      })
      .on('mouseout', function (d, i) {
        d3.select(this)
          .style('fill', color(i))
          .style('font-size', (d) => d.size + 'px')
      })
  }
}

export default renderCloud
