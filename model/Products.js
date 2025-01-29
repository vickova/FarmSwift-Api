import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
      },
    description: {
      type: String,
      required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["fruits", "grains", "tuber", "vegetables", "livestock", "poultry"], // Valid categories, 
      },
      price: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);

// name
// description
// category
// price
// photo