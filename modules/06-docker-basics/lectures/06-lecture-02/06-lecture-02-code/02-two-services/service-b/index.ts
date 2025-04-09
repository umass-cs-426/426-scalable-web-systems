import express from 'express'

const app = express()
app.get('/hello', (req, res) => res.send('Hello from B 👋'))
app.listen(4000, () => console.log('Service B listening on port 4000'))
