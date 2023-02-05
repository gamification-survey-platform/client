import axios from 'axios'

const login = async ({ username, password }) => {
  const res = await axios({
    method: 'POST',
    data: JSON.stringify({ username, password })
  })

  return res
}

export { login }
