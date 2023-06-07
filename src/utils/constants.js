const prod = {
  API_URL: 'http://ec2-13-57-207-133.us-west-1.compute.amazonaws.com:8000/api'
}

const dev = {
  API_URL: 'http://localhost:8000/api'
}

export default process.env.NODE_ENV === 'production' ? prod : dev
