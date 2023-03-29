// 유저에 관련된 데이터를 보관하기 위한 유저 모델/스키마 생성하기
// 모델 : 스키마를 감싸준다
// 스키마 : 각 항목에 대한 상세정보 타입\


// 몽구스 모듈 가져오기
const mongoose = require('mongoose');

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

// 스키마를 모델로 감싸주기
const User = mongoose.model('User', userSchema)

// 이 모델을 다른 곳에서도 쓸 수 있게 export
module.exports = {User}