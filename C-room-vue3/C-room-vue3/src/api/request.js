import axios from 'axios'

const service = axios.create({
  baseURL: 'http://8.134.127.25', // 你的远程接口地址
  timeout: 5000
})

export default service