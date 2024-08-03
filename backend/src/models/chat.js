const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

const chatSchema = new Schema({
    
    //ad alag alag karnay ki zarorat kio , takay chat say osko ad dikh saken ad har ad ka lag model ha tu isko os hisab say karna para , jis category ka ad hoga wo os 
    mobileAdId:{
        type:Schema.Types.ObjectId,
        ref:'mobile'
    },
    vehicleAdId:{
        type:Schema.Types.ObjectId,
        ref:'vehicle'
    },
    jobAdId:{
        type:Schema.Types.ObjectId,
        ref:'job'
    },
    serviceAdId:{
        type:Schema.Types.ObjectId,
        ref:'service'
    },
    //messages ka array iska model uper ha
    messages:[messageSchema],

    seller:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    buyer:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    adTitle:{
        type:String,
        required:true
    },
    adPrice:{
        type:Number,
        required:true
    }
},{timestamps:true})

const Chat = model("Chat",chatSchema)
module.exports = Chat