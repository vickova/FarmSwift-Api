import Order from "../model/Order.js";
import Cart from "../model/Cart.js";
import Flutterwave from "flutterwave-node-v3";
import dotenv from "dotenv";

dotenv.config();

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const { userId, email, name, shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Calculate total amount
    const totalAmount = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Generate unique transaction reference
    const transactionRef = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Create order in DB
    const order = new Order({
      user: userId,
      products: cart.products,
      totalAmount,
      shippingAddress,
      paymentReference: transactionRef,
      paymentStatus: "pending",
    });

    await order.save();

    // Generate Flutterwave payment link
    const response = await flw.PaymentInitiate({
      tx_ref: transactionRef,
      amount: totalAmount,
      currency: "NGN",
      redirect_url: `http://localhost:5000/api/orders/verify/${transactionRef}`,
      customer: {
        email,
        name,
      },
      payment_options: "card, banktransfer, ussd",
    });

    if (response.status !== "success") {
      return res.status(400).json({ success: false, message: "Failed to initiate payment" });
    }

    // Clear the cart after successful order creation
    await Cart.findOneAndUpdate({ user: userId }, { products: [] });

    res.status(200).json({
      success: true,
      message: "Order created, complete payment",
      paymentLink: response.data.link,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};
