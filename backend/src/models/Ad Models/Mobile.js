const { Schema, model } = require("mongoose");
const { schema } = require("../chat");

const mobileSchema = new Schema(
  {
    category: {
        type: String , 
        required: true
    } , 
     imagesURL : [
        {
          type: String  
        }
     ]  , 
     brand: {
        type: String ,
        required: true
     } , 
     condition: {
        type: String , 
        required: true
     } , 
     adTitle: {
        type: String , 
        required: true
     } , 
     description : {
        type: String , 
        required: true
     } , 
     province: {
        type: String , 
        required: true
     } , 
     city: {
        type: String , 
        required: true
     } , 
     price: {
        type: Number, 
        required: true
     } , 
     ownerName: {
        type: String , 
        required: true 
     } , 
     mobileNo: {
        type: String , 
        required :true
     },
     createdBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
     }
  },
  { timestamps: true }
);
const Mobile = model("mobile", mobileSchema);
module.exports = Mobile;
