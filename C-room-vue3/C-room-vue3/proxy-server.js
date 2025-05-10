const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
const PORT = 3001

app.get('/api/users/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://8.134.127.25/api/users/${req.params.id}`)
    res.json(response.data)
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`CORS代理服务器运行在 http://localhost:${PORT}`)
})