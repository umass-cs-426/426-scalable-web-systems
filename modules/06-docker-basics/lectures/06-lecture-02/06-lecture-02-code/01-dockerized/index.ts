// index.ts
import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.get('/', (_req, res) => {
  res.send('Hello from a TypeScript Express server! 🚀')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
