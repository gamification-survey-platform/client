import * as d3 from 'd3'
import Basketball from '../assets/basketball.jpg'
import BasketballHoop from '../assets/basketballHoop.jpeg'
import Soccerball from '../assets/soccerball.png'
import SoccerNet from '../assets/soccerNet.png'
import Football from '../assets/football.jpeg'
import Goalpost from '../assets/goalPost.png'

const renderScene = ({ width, options, ref, handleSelect, questionType, update = false }) => {
  // If simply updating, no need to recreate SVG
  if (update) {
    const objects = d3.select(ref).select('#scene').selectAll('.object')
    objects.transition().attr('transform', (d) => {
      const option = options.find((option) => option.text === d.text)
      if (option.transitioned) d.transitioned = true
      else d.transitioned = false
      return d.transitioned
        ? `translate(${d.end.x}, ${d.end.y})`
        : `translate(${d.start.x}, ${d.start.y})`
    })
    return
  }

  const variants = ['basketball', 'football', 'soccer']
  const variant = variants[d3.randomInt(variants.length)()]

  // Create SVG
  const wrapperRef = d3.select(ref)
  wrapperRef.select('svg').remove()
  const height = 100
  const objectSize = 50
  const svg = wrapperRef.append('svg').attr('height', height).attr('width', width).append('g')
  const widthMargin = 50
  const sceneWidth = width - widthMargin * 2

  // Create inner scene
  const scene = svg
    .append('g')
    .attr('id', 'scene')
    .attr('height', height)
    .attr('width', sceneWidth)
    .attr('transform', `translate(${widthMargin}, 0)`)

  const targetSize = 100

  // Store endpoint at right most part of scene
  let endPoint = { x: sceneWidth - objectSize, y: 0 + targetSize - objectSize }
  const target = scene
    .append('svg:image')
    .attr('x', sceneWidth - targetSize)
    .attr('y', height - targetSize)
    .attr('width', targetSize)
    .attr('height', targetSize)
    .attr('xlink:href', () => {
      if (variant === 'basketball') return BasketballHoop
      else if (variant === 'soccer') return SoccerNet
      else if (variant === 'football') return Goalpost
    })

  // Create object data join
  const objectsData = options.map((opt, i) => {
    const startX = 0 + i * objectSize + i * 40
    const endX = endPoint.x - i * objectSize - i * 40
    const start = { x: startX, y: height - objectSize }
    const end = { x: endX, y: endPoint.y }
    const midpoint = { x: (endX + startX) / 2, y: 0 }
    const points = [start, midpoint, endPoint, end]
    const line = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveBasis)
    const path = line(points)
    return { start, end: questionType === 'MULTIPLESELECT' ? end : endPoint, path, ...opt }
  })
  const objects = scene.selectAll('.object').data(objectsData)

  function translateAlong(path) {
    const length = path.getTotalLength()
    return () => {
      return (t) => {
        const { x, y } = path.getPointAtLength(t * length)
        return `translate(${x},${y})`
      }
    }
  }

  const groups = objects
    .enter()
    .append('g')
    .attr('class', 'object')
    .attr('transform', (d) =>
      d.transitioned ? `translate(${d.end.x}, ${d.end.y})` : `translate(${d.start.x}, ${d.start.y})`
    )
    .on('click', function (event, d) {
      const object = d3.select(this)
      if (!d.transitioned) {
        d.transitioned = true
        object
          .transition()
          .duration(1000)
          .attr('transform', (d) => `translate(${d.end.x}, ${d.end.y})`)

        if (questionType !== 'MULTIPLESELECT') {
          // If not multipleselect, transition preselected values back
          handleSelect(d.text)
          svg
            .selectAll('.object')
            .transition()
            .duration(1000)
            .attr('transform', function (otherD) {
              if (otherD.text === d.text) return `translate(${otherD.end.x}, ${otherD.end.y})`
              else {
                otherD.transitioned = false
                return `translate(${otherD.start.x}, ${otherD.start.y})`
              }
            })
        } else {
          // If multiple Select, choose all selected values
          const selected = objectsData.filter((obj) => obj.transitioned).map((obj) => obj.text)
          handleSelect(selected)
        }
      } else {
        d.transitioned = false
        handleSelect('')
        object
          .transition()
          .duration(1000)
          .attr('transform', (d) => `translate(${d.start.x}, ${d.start.y})`)
      }
    })
  /*
  scene
    .selectAll('.path')
    .data(objectsData)
    .enter()
    .append('path')
    .attr('id', (d, i) => `path-${i}`)
    .attr('d', (d) => d.path)
    .attr('stroke', 'black')
    .attr('fill', function (d) {
      const node = d3.select(this).node()
      const length = node.getTotalLength()
      d.pathLength = length
      return 'none'
    })
  */
  groups
    .append('svg:image')
    .attr('height', objectSize)
    .attr('width', objectSize)
    .attr('xlink:href', () => {
      if (variant === 'basketball') return Basketball
      else if (variant === 'soccer') return Soccerball
      else if (variant === 'football') return Football
    })

  groups
    .append('text')
    .attr('class', 'text')
    .text((d) => d.text)
    .style('font-size', 12)
    .style('font-weight', 'bold')
    .attr('y', objectSize / 2)

  d3.selectAll('.text').each(function (d) {
    const node = d3.select(this).node()
    const textRect = node.getBBox()
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', textRect.x)
    rect.setAttribute('y', textRect.y)
    rect.setAttribute('width', textRect.width)
    rect.setAttribute('height', textRect.height)
    rect.setAttribute('fill', 'yellow')
    const parent = node.parentElement
    parent.insertBefore(rect, node)
  })
}

export default renderScene
