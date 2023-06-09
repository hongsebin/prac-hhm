// 유저에 관련된 데이터를 보관하기 위한 유저 모델/스키마 생성하기
// 모델 : 스키마를 감싸준다
// 스키마 : 각 항목에 대한 상세정보 타입\


// 몽구스 모듈 가져오기
const mongoose = require('mongoose');

// bcrypt 가져오기
const bcrypt = require('bcrypt');
const saltRounds = 10

// jsonwebtoken 가져오기
const jwt = require('jsonwebtoken');

// 몽구스를 이용해서 스키마 생성하기
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    
    // 토큰을 이용해서 유효성 관리 가능
    token: {
        type: String
    },

    // 토큰 유효기간
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ) {
    var user = this;

    if(user.isModified('password')) {
        // 저장 전 비밀번호를 암호화시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword = 1234567 / 암호화된 비밀번호 = $2b$10$W8ABOLWLRYhhMk30OEpzOOCUFSwNDQp7KqMJybIHJYuG69.yDY8am
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
            cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    // Jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}


// middleware/auth에서 만든 findByToken
userSchema.statics.findByToken = function( token, cb) {
    var user = this;

    // 토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음
        // 클라이언트에서 가져온 token과 db에 보관된 token이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function (err, user) {
            
            if(err) return cb(err);
            cb(null, user)
        })
    })
}


// 스키마를 모델로 감싸주기
const User = mongoose.model('User', userSchema)

// 이 모델을 다른 곳에서도 쓸 수 있게 export
module.exports = { User }




