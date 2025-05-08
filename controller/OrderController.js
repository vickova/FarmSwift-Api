import Order from "../model/Order.js";
import Cart from "../model/Cart.js";
import Flutterwave from "flutterwave-node-v3";
import dotenv from "dotenv";
import Products from "../model/Products.js";
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
    const { userId, email, name, shippingAddress, remarks } = req.body;

    const cart = await Cart.findOne({ user: userId });
    console.log("Cart:", cart);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Update the products with their seller IDs
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        console.log("Cart Item:", item);
        const product = await Products.findById(item.product);
        console.log("Product:", product);
        return {
          product: product._id,
          quantity: item.quantity,
          seller: product.createdBy // Assuming the 'Product' model has a 'seller' field
        };
      })
    );

    // Calculate the total amount based on the cart items
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const transactionRef = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const order = new Order({
      user: userId,
      name,
      email,
      products: orderItems,
      totalAmount,
      remarks,
      shippingAddress,
      paymentReference: transactionRef,
      paymentStatus: "pending",
    });
    console.log("Order:", {
      user: userId,
      name,
      email,
      products: orderItems,
      totalAmount,
      remarks,
      shippingAddress,
      paymentReference: transactionRef,
      paymentStatus: "pending",
    });
    await order.save();

    // Optional: Clear cart after order
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
      transactionRef
    });

  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await Order.find({ user: id });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};


export const initializePayment = async (req, res) => {
    try {
        const { email, amount, orderId, transactionRef } = req.body;

        // Prepare payment data
        const paymentData = {
            tx_ref: transactionRef, // Unique transaction reference
            amount: amount, // Amount to be paid
            currency: "NGN",
            redirect_url: "http://localhost:3000/payment-status",
            payment_options: "card, banktransfer, ussd",
            customer: {
                email: email
            },
            customizations: {
                title: "FarmSwift Payment",
                description: "Payment for order",
                logo: "https://i.postimg.cc/Vky15wfy/swift-logo-rm.png"
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
        return res.json({success: true,
          message: "Order created, complete payment", checkoutUrl: response.data.data.link });
        // await Cart.findOneAndUpdate({ user:  req.user.id }, { products: [] });

    } catch (error) {
        res.status(500).json({ error: error.response?.data || "Payment initialization failed" });
    }
};


export const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const flutterwaveRes = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    const paymentData = flutterwaveRes.data.data;

    if (paymentData.status === "successful") {
      // Update order in DB
      await Order.findOneAndUpdate(
        { paymentReference: paymentData.tx_ref },
        { paymentStatus: "paid" },
        { new: true, runValidators: true }

      );

      return res.status(200).json({
        success: true,
        message: "Payment verified",
        data: {
          amount: paymentData.amount,
          tx_ref: paymentData.tx_ref,
          status: paymentData.status,
        },
      });
    } else {
      await Order.findOneAndUpdate(
        { paymentReference: paymentData.tx_ref },
        { paymentStatus: "failed" }
      );

      return res.status(200).json({
        success: false,
        message: "Payment not successful",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// GET /api/seller/orders/:sellerId
export const getSellerOrders = async (req, res) => {
  const { sellerId } = req.params;
  try {
    // Get all orders where the seller is associated with any product
    const orders = await Order.find({ "products.seller": sellerId })
      .sort({ createdAt: -1 });
    // console.log("Seller Orders:", orders);
    // Optional: Filter out orders to include only the products sold by the seller
    const sellerOrders = orders.map(order => {
      const sellerProducts = order.products.filter(p => p.seller.toString() === sellerId.toString());
      return {
        ...order.toObject(),
        products: sellerProducts,
        totalSellerAmount: sellerProducts.reduce((sum, p) => sum + p.product.price * p.quantity, 0)
      };
    });

    res.json({ success: true, data: sellerOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching seller orders" });
  }
};
