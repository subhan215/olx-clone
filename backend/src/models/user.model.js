const mongoose =require('mongoose')
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    //iska baad main dekhen gay
    password:{
        type:String,
        required:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String,
        required:true
    },
    contactNumber:{
        type:Number,
        required:false
    },
    //iska baad main dekhen gay
    refreshToken:{
        type:String
    }
},{timestamps:true})

export const User = mongoose.model("User",userSchema)
