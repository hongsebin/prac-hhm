const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const config = require('./server/config/key');
const { User } = require("./models/User");
const { auth } = require('./server/config/middleware/auth');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// bodyparser = client에서 오는 정보를 서버에서
//              분석해서 가져올 수 있게 해줌

// application/x-www-form-urlencoded <-데이터를 분석해서 가져올 수 있게
app.use(bodyParser.urlencoded({extended: true}));

// application/json <-데이터를 분석해서 가져올 수 있게
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕!')
})


// resgister route 만들기
app.post('/api/users/register', (req, res) => {
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


// login기능 - login route 만들기
app.post('/api/users/login', (req, res) => {
  // 1. 요청된 이메일이 데이터베이스에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 2. 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err,isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
      
      // 3. 비밀번호가 맞다면 토큰을 생성한다.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
  
        // token을 쿠키에 저장한다.
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

// role이 0이면 일반유저 / role이 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과했다는 얘기는 authentication이 treu라는 뜻.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})


// 로그아웃 route 만들기
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id},
    { token: ""}
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})