const path = require('path')
const express = require('express')
const request = require('request');
const app = express(),
  DIST_DIR = path.join(__dirname, '../app'),
  HTML_FILE = path.join(DIST_DIR, 'index.html')
app.use(express.static(DIST_DIR))

// const urls_list = ['/', '/catalog', '/cart', '/conditions'];

// for (const item of urls_list) {
  app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
  })
// }

app.use('/static/dist', express.static(DIST_DIR))

const PORT = 5050

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
})