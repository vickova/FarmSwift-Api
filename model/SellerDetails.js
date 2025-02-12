import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  bankName: { type: String }, // Can be added later
  accountNumber: { type: String },
  bankCode: { type: String },
});

export default mongoose.model('SellerDetails', SellerSchema);
