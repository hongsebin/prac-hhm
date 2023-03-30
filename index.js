const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const config = require('./config/key');
const { User } = require("./models/User");


// bodyparser = client에서 오는 정보를 서버에서
//              분석해서 가져올 수 있게 해줌

// application/x-www-form-urlencoded <-데이터를 분석해서 가져올 수 있게
app.use(bodyParser.urlencoded({extended: true}));

// application/json <-데이터를 분석해서 가져올 수 있게
app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕!')
})


// resgister route 만들기
app.post('/register', (req, res) => {
  // 회원가입 시 필요한 정보를 client에서 가져오면
  // 그것들을 database에 넣어준다.
  
  const user = new User(req.body)

  user.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})