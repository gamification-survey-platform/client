export const getSentimentEmoji = (score) => {
  if (score > 3) return '&#x1F60D;'
  else if (score > 0) return '&#128522;'
  else if (score === 0) return '&#128528;'
  else if (score > -3) return '&#128542;'
  else return '&#129326;'
}
