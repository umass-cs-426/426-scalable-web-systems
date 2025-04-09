// index.ts
import express from 'express'
import fs from 'fs'

// Check if running in Docker container
const inDocker = fs.existsSync('/.dockerenv');

const app = express()
const port = process.env.PORT || 3000

app.get('/', (_req, res) => {
  const message = `
  Hello from a TypeScript Express server! 🚀<br>
  Am I in a Docker container? ${inDocker ? 'Yes!' : 'No.'}
  `;
  
  res.send(message);
})

app.listen(port, () => {
  console.log(`Server is running on Port ${port}!`)
})
