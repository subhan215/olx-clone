const { Schema, model } = require("mongoose");

const mobileSchema = new Schema(
  {
    category: {
        type: String , 
        required: true
    } , 
    subCategory: {
        type: String
    }
     , 
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
     location: {
        type: String , 
        required: true
     } , 
     price: {
        type: Number, 
        required: true
     } , 
     ownerName: {
        type: string , 
        required: true 
     } , 
     mobileNo: {
        type: String , 
        required :true
     }

  },
  { timestamps: true }
);
const Mobile = model("mobile", mobileSchema);
module.exports = Mobile;
