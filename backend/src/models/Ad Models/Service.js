const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
  {
    category: {
        type: String , 
        required: true
    } , 
     imagesURL : [
        {
          type: String  
        }
     ]   ,
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
const Service = model("service", serviceSchema);
module.exports = Service;
