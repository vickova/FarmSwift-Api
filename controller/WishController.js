import Products from "../model/Products.js";
import Wish from "../model/Wish.js";

export const addToWish = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id; // Assuming req.user is set by authentication middleware

  try {
    // Check if the product exists
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Ensure only customers can add to wish
    if (req.user.role !== "customer") {
      return res.status(400).json({ success: false, message: "Only customers can add to wish" });
    }

    // Find or create wish for the user
    let wish = await Wish.findOne({ user: userId });

    if (!wish) {
      // Create a new wish if not found
      wish = new Wish({
        user: userId,
        items: [],
      });
    }

    // Check if product is already in wish
    const existingItem = wish.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      // If product exists, update quantity
      return res.status(400).json({ success: false, message: "Already in the wish list" });
    }else {
      // Add new product to cart
      wish.items.push({
        product: productId,
        price: product.price,
      });
    }


    await wish.save();

    return res.status(200).json({ success: true, message: "Product added to wish", wish });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



export const deleteFromWish = async (req, res) => {
  const userId = req.user.id; // Assuming req.user is set by authentication middleware
  const productId = req.params.id; // Product ID to be removed

  try {
    // Find the user's active wish
    const wish = await Wish.findOne({ user: userId });

    if (!wish) {
      return res.status(404).json({ success: false, message: "Wish not found" });
    }

    // Check if the product exists in the wish
    const itemIndex = wish.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in wish" });
    }

    // Remove the product from the wish
    wish.items.splice(itemIndex, 1);

    // Save the updated wish
    await wish.save();

    return res.status(200).json({ success: true, message: "Product removed from wish", wish });
  } catch (error) {
    console.error("Error removing item from wish:", error.message);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllWishItems = async (req, res)=>{

  try {
    const { id } = req.params;  // Get userId from URL params

        const cartItems = await Wish.findOne({ user: id }).populate("items.product");
        console.log(cartItems)
        res.status(200).json({success:true,count:cartItems.items.length, message:'Successful', data:cartItems.items})
    } catch (err) {
        res.status(404).json({success:false, message:err})
    }

}