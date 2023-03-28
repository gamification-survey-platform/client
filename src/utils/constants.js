const prod = {
  API_URL: 'https://gamification-server.onrender.com/api',
  FILE_URL: 'https://gamification-server.onrender.com'
}

const dev = {
  API_URL: 'http://localhost:8000/api',
  FILE_URL: 'http://localhost:8000'
}

export default process.env.NODE_ENV === 'production' ? prod : dev
