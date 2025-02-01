import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    items: [cartItemSchema], // Array of products in the cart
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "ordered"], // 'active' means the user hasn't checked out yet
      default: "active",
    },
  },
  { timestamps: true }
);

// Auto-update total price before saving the cart
cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((total, item) => total + item.quantity * item.price, 0);
  next();
});

export default mongoose.model("Cart", cartSchema);
