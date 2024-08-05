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
    
    ad: {
      adId: {
          type: Schema.Types.ObjectId,
          required: true,
      },
      adType: {
          type: String,
          required: true,
          enum: ['Mobile Phones', 'vehicle', 'job', 'service'], // Ensure it matches the model names
      },
    },
    // mobileAdId:{
    //     type:Schema.Types.ObjectId,
    //     ref:'mobile'
    // },
    // vehicleAdId:{
    //     type:Schema.Types.ObjectId,
    //     ref:'vehicle'
    // },
    // jobAdId:{
    //     type:Schema.Types.ObjectId,
    //     ref:'job'
    // },
    // serviceAdId:{
    //     type:Schema.Types.ObjectId,
    //     ref:'service'
    // },
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

//const allChats = async (req, res) => {
  //     const { user } = req.body;
  //     // User ID is provided
  //     try {
  //       const chats = await Chat.find({
  //         $or: [{ seller: user }, { buyer: user }]
  //       }).populate({
  //         path: 'ad.adId',
  //         select: 'adTitle brand price ownerName',
  //         model: (doc) => {
  //           switch (doc.ad.adType) {
  //             case 'Mobile Phones':
  //               return mongoose.model('mobile');  // Ensure the model name matches the one used in schema registration
  //             case 'vehicle':
  //               return mongoose.model('vehicle');  // Ensure the model name matches the one used in schema registration
  //             case 'job':
  //               return mongoose.model('job');  // Ensure the model name matches the one used in schema registration
  //             case 'service':
  //               return mongoose.model('service');  // Ensure the model name matches the one used in schema registration
  //             default:
  //               throw new Error('Unknown ad type');
  //           }
  //         }
  //       });
    
  //       return res.status(200).json({
  //         success: true,
  //         chat: chats,
  //         message: 'Chats retrieved'
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       return res.status(400).json({
  //         success: false,
  //         message: 'Cannot retrieve your chats'
  //       });
  //     }
  //   };