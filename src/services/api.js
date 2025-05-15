import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://123.206.217.44:3000/api'
})

export default apiClient