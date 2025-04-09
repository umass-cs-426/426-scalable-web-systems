import express from 'express'

const app = express()

app.get('/call-b', async (_req, res) => {
  try {
    const response = await fetch('http://api-b/hello')
    const text = await response.text()
    res.send(`api-a got response: "${text}"`)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
})

app.listen(3000, () => console.log('Service A listening on port 3000'))
