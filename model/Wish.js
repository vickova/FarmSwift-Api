import mongoose from "mongoose";

const wishItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const wishSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    items: [wishItemSchema], // Array of products in the wish
    status: {
      type: String,
      enum: ["active", "ordered"], // 'active' means the user hasn't checked out yet
      default: "active",
    },
  },
  { timestamps: true }
);


export default mongoose.model("Wish", wishSchema);
