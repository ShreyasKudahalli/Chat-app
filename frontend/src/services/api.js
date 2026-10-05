import axios from "axios"

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/accounts',
})

export const registerUser = async (userData) => {
  const response = await api.post('/register/', userData)
  return response.data
}

export const loginUser = async (credentials) => {
  const response = await api.post('/login/', credentials)
  return response.data
}

export default api


