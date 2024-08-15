const { model, Schema } = require("mongoose");

const transactionSchema = new Schema({
    seller: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    //categoryType: { type: String, enum: ['Product', 'Job', 'Vehicle' , 'Mobile'], required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    job: { type: Schema.Types.ObjectId, ref: 'job' },
    service: { type: Schema.Types.ObjectId, ref: 'service' },
    vehicle: { type: Schema.Types.ObjectId, ref: 'vehicle' },
    mobile: {type: Schema.Types.ObjectId, ref: 'mobile'} , 
    rating: { type: Number, min: 0, max: 5, default: null },
    adTitle: {type: String,  required: true}
} , {timestamps: true});

module.exports = model('Transaction', transactionSchema);
