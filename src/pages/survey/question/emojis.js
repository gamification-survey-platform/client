const positiveEmojis = [
  '&#128170',
  '&#128175',
  '&#128076',
  '&#129311',
  '&#129305',
  '&#128077',
  '&#128079',
  '&#128588',
  '&#128170',
  '&#11088;',
  '&#x2705;'
]

export const getRandomEmoji = (type) => {
  if (type === 'positive') {
    const length = positiveEmojis.length
    const randIdx = Math.floor(Math.random() * length)
    return positiveEmojis[randIdx]
  }
  return ''
}
