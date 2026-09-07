const mongoose= require('mongoose');
const otpSchema= new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    name:{
        type: String
    },
    password:{
        type: String
    },
    otp:{
        type: String,
        required: true
    },
    action:{
        type: String,
        enum: ['account_verification','event_booking'],
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 300 
    }

}); 
module.exports= mongoose.model('OTP',otpSchema);