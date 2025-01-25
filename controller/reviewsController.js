import User from '../model/User.js';


export const addReview = async (req, res) => {
  try {
    const { sellerId, rating, review } = req.body;

    // Check if the seller exists and is actually a seller
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }
    if (seller.role !== "seller") {
      return res
        .status(400)
        .json({ success: false, message: "Only sellers can receive reviews" });
    }

    // Ensure the customer hasn't already reviewed this seller (optional)
    const existingReview = seller.reviews.find(
      (r) => r.reviewer.toString() === req.user.id
    );
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this seller" });
    }

    // Add the new review
    const newReview = {
      rating,
      review,
      reviewer: req.user.id, // Assumes req.user contains the logged-in customer info
    };
    seller.reviews.push(newReview);

    // Save the seller with the updated reviews
    await seller.save();

    return res.status(200).json({ success: true, message: "Review added successfully", reviews: seller.reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
