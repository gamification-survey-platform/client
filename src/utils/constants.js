const prod = {
  API_URL: ''
}

const dev = {
  API_URL: 'http://localhost:8000/api'
}

export default process.env.NODE_ENV === 'production' ? prod : dev
