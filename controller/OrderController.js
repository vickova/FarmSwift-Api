import Order from "../model/Order.js";
import Cart from "../model/Cart.js";
import Flutterwave from "flutterwave-node-v3";
import dotenv from "dotenv";
import axios from 'axios';


dotenv.config();
// console.log("FLW_PUBLIC_KEY:", process.env.FLW_PUBLIC_KEY);
// console.log("FLW_SECRET_KEY:", process.env.FLW_SECRET_KEY);
// console.log("FLW_ENCRYPTION_KEY:", process.env.FLW_ENCRYPTION_KEY);

if (!process.env.FLW_PUBLIC_KEY || !process.env.FLW_SECRET_KEY || !process.env.FLW_ENCRYPTION_KEY) {
    throw new Error("Flutterwave API keys are missing in .env file");
}

// Initialize Flutterwave with Encryption Key
const flw = new Flutterwave(
    process.env.FLW_PUBLIC_KEY,
    process.env.FLW_SECRET_KEY,
);
export const createOrder = async (req, res) => {
  try {
    const { userId, email, name, shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Generate unique transaction reference
    const transactionRef = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Create order in DB
    const order = new Order({
      user: userId,
      products: cart.items,
      totalAmount,
      shippingAddress,
      paymentReference: transactionRef,
      paymentStatus: "pending",
    });

    await order.save();

    

    // Clear the cart after successful order creation
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: error });
  }
};



export const initializePayment = async (req, res) => {
    try {
        const { email, amount, orderId } = req.body;

        // Prepare payment data
        const paymentData = {
            tx_ref: `txn_${Date.now()}`, // Unique transaction reference
            amount: amount, // Amount to be paid
            currency: "NGN",
            redirect_url: "https://yourfrontend.com/payment-success",
            payment_options: "card, banktransfer, ussd",
            customer: {
                email: email
            },
            customizations: {
                title: "FarmSwift Payment",
                description: "Payment for order",
                logo: "https://yourlogo.com/logo.png"
            }
        };

        // Call Flutterwave API to initialize payment
        const response = await axios.post(
            "https://api.flutterwave.com/v3/payments",
            paymentData,
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY }`,
                    "Content-Type": "application/json"
                }
            }
        );

        // Send Flutterwave checkout link to the frontend
        res.json({success: true,
          message: "Order created, complete payment", checkoutUrl: response.data.data.link });
        await Cart.findOneAndUpdate({ user:  req.user.id }, { products: [] });

    } catch (error) {
        res.status(500).json({ error: error.response?.data || "Payment initialization failed" });
    }
};
