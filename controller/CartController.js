import Products from "../model/Products.js";
import Cart from "../model/Cart.js";
import User from "../model/User.js";

export const addToCart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id; // Assuming req.user is set by authentication middleware

  try {
    // Check if the product exists
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Ensure only customers can add to cart
    if (req.user.role !== "customer") {
      return res.status(400).json({ success: false, message: "Only customers can add to cart" });
    }

    // Find or create cart for the user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart if not found
      cart = new Cart({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if product is already in cart
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      // If product exists, update quantity
      existingItem.quantity += 1;
    } else {
      // Add new product to cart
      cart.items.push({
        product: productId,
        quantity: 1,
        price: product.price,
      });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Save updated cart
    await cart.save();

    return res.status(200).json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



export const deleteFromCart = async (req, res) => {
  const userId = req.user.id; // Assuming req.user is set by authentication middleware
  const productId = req.params.id; // Product ID to be removed

  try {
    // Find the user's active cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Check if the product exists in the cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }
    // Remove the product from the cart
    cart.items.splice(itemIndex, 1);

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Save the updated cart
    await cart.save();

    return res.status(200).json({ success: true, message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error removing item from cart:", error.message);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllCartItems = async (req, res) => {
  try {
    const { id } = req.params; // Get userId from URL params

    const userExists = await User.findById(id); // Check if user exists
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartItems = await Cart.findOne({ user: id }).populate("items.product");

    if (!cartItems) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: "No cart items found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: cartItems.items.length,
      message: "Successful",
      data: cartItems.items,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
