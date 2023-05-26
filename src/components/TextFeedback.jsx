import { useState, useEffect } from 'react'
import Sentiment from 'sentiment'
import Awesome1 from '../assets/reactions/awesome/awesome1.gif'
import Awesome2 from '../assets/reactions/awesome/awesome2.gif'
import Awesome3 from '../assets/reactions/awesome/awesome3.gif'
import Good1 from '../assets/reactions/good/good1.gif'
import Good2 from '../assets/reactions/good/good2.gif'
import Good3 from '../assets/reactions/good/good3.gif'
import Disappointed1 from '../assets/reactions/disappointed/disappointed1.gif'
import Disappointed2 from '../assets/reactions/disappointed/disappointed2.gif'
import Disappointed3 from '../assets/reactions/disappointed/disappointed3.gif'
import Disgusted1 from '../assets/reactions/disgusted/disgusted1.gif'
import Disgusted2 from '../assets/reactions/disgusted/disgusted2.gif'
import Disgusted3 from '../assets/reactions/disgusted/disgusted3.gif'

const awesome = [Awesome1, Awesome2, Awesome3]
const good = [Good1, Good2, Good3]
const disappointed = [Disappointed1, Disappointed2, Disappointed3]
const disgusted = [Disgusted1, Disgusted2, Disgusted3]
const TextFeedback = ({ text }) => {
  const sentiment = new Sentiment()
  const [response, setResponse] = useState()
  useEffect(() => {
    const setImage = (score) => {
      if (score === 0) {
        setResponse()
        return
      }
      let img
      if (score < -5) {
        img = disgusted[Math.floor(Math.random() * disgusted.length)]
      } else if (score > -5 && score < -1) {
        img = disappointed[Math.floor(Math.random() * disappointed.length)]
      } else if (score > -1 && score < 1) {
        img = good[Math.floor(Math.random() * good.length)]
      } else {
        img = awesome[Math.floor(Math.random() * awesome.length)]
      }
      setResponse(img)
    }
    const { score } = sentiment.analyze(text)
    setImage(score)
  }, [text])
  return response ? <img src={response} /> : null
}

export default TextFeedback
