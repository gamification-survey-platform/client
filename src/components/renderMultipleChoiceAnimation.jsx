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
    objects
      .transition()
      .duration(1000)
      .attrTween('transform', function (d, i) {
        const currentPosition = d3.select(this).attr('transform')
        const regex = new RegExp('translate\\((\\d*\\.?\\d*), (\\d*\\.?\\d*)\\)', 'gm')
        const [_, currX, currY] = regex.exec(currentPosition)
        return function (t) {
          const node = d3.select(ref).select(`#path-${i}`).node()
          // At start
          if (parseFloat(currX) === d.start.x && parseFloat(currY) === d.start.y) {
            // Should transition forward
            if (d.transitioned) {
              const { x, y } = node.getPointAtLength(t * d.pathLength)
              return `translate(${x}, ${y})`
            } else {
              return `translate(${d.start.x}, ${d.start.y})`
            }
          } else {
            // Should transition backward
            if (!d.transitioned) {
              const { x, y } = node.getPointAtLength((1 - t) * d.pathLength)
              return `translate(${x}, ${y})`
            } else {
              return `translate(${d.end.x}, ${d.end.y})`
            }
          }
        }
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
    let line = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveLinear)
    const pathTypes = ['linear', 'arc', 'zigzag']
    const pathType = pathTypes[Math.floor(Math.random() * pathTypes.length)]
    let points = [start]
    if (pathType === 'linear') {
      points.push(endPoint)
    } else if (pathType === 'arc') {
      const midpoint = { x: (endX + startX) / 2, y: 0 }
      points = points.concat([midpoint, endPoint])
      line.curve(d3.curveBasis)
    } else if (pathType === 'zigzag') {
      const midpoint1 = { x: ((endX + startX) * 1) / 4, y: 0 }
      const midpoint2 = { x: ((endX + startX) * 1) / 2, y: endPoint.y }
      const midpoint3 = { x: ((endX + startX) * 3) / 4, y: 0 }
      points = points.concat([midpoint1, midpoint2, midpoint3, endPoint])
    }
    if (questionType === 'MULTIPLESELECT') points.push(end)
    const path = line(points)
    return { start, end: questionType === 'MULTIPLESELECT' ? end : endPoint, path, ...opt }
  })
  const objects = scene.selectAll('.object').data(objectsData)

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
        if (questionType !== 'MULTIPLESELECT') {
          // If not multipleselect, transition preselected values back
          objectsData.forEach((obj) => (obj.transitioned = false))
          d.transitioned = true
          handleSelect(d.text)
        } else {
          // If multiple Select, choose all selected values
          d.transitioned = true
          const selected = objectsData.filter((obj) => obj.transitioned).map((obj) => obj.text)
          handleSelect(selected)
        }
      } else {
        d.transitioned = false
        if (questionType !== 'MULTIPLESELECT') {
          handleSelect('')
        } else {
          // If multiple Select, choose all selected values
          const selected = objectsData.filter((obj) => obj.transitioned).map((obj) => obj.text)
          handleSelect(selected)
        }
      }
    })
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
