const { Schema, model } = require("mongoose");

const vehicleSchema = new Schema(
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
     make: {
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
const Vehicle = model("vehicle", vehicleSchema);
module.exports = Vehicle;