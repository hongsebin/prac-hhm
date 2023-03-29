const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hongsb5837:sebin1624@hhm.zms8omz.mongodb.net/?retryWrites=true&w=majority', {
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})