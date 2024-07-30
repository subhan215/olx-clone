const { Schema, model } = require("mongoose");

const jobSchema = new Schema(
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
     hiringPersonOrCompany: {
        type: String , 
        required: true
     } , 
     companyName: {
        type: String , 
        required: true
     }  , 
     typeOfAd: {
        type: String , 
        required: true
     } , 
     salaryFrom : {
        type: Number, 
        required: true
     } , 
     salaryTo: {
        type: Number, 
        required: true
     } , 
     careerLevel: {
        type: String, 
        required: true
     } , 
     salaryPeriod: {
        type: String, 
        required: true
     } , 
     positionType: {
        type: String, 
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
     ownerName: {
        type: String , 
        required: true 
     } , 
     mobileNo: {
        type: String , 
        required :true
     }

  },
  { timestamps: true }
);
const Job = model("job", jobSchema);
module.exports = Job;
