export const mockBarChartData = [...Array(4)]
  .map((_) => '1')
  .concat([...Array(10)].map((_) => '2'))
  .concat([...Array(3)].map((_) => '3'))
  .concat([...Array(20)].map((_) => '4'))
  .concat([...Array(7)].map((_) => '5'))

export const mockHistogramData = [...Array(100)].map(() =>
  Math.floor(Math.abs(Math.random() * 100))
)

export const mockPieChartData = {
  a: 10,
  b: 20,
  c: 30,
  d: 40,
  e: 50
}

export const mockStackedBarChartData = {
  labels: ['1', '2', '3'],
  data: [{ q1: [10, 20, 30] }, { q2: [10, 4, 3] }, { q3: [3, 1, 5] }]
}
