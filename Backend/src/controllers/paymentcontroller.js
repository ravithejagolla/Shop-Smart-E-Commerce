import { user } from "../models/User.js";
import { createRazorpayInstance } from "../config/razorpay.config.js";

const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const userFetch = await user.findById(userId).populate({
      path: "cart.productId",
      model: "Product",
      select: "title price",
    });

    // console.log(userFetch);

    if (!userFetch || userFetch.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    for (const item of userFetch.cart) {
      if (!item.productId || item.productId.stock) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      totalAmount += item.productId.price * item.quantity;
    }

    // console.log(totalAmount);

    var options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const razorpayInstance = createRazorpayInstance();

    const payResponse = await razorpayInstance.orders.create(options);

    console.log(payResponse);

    if (!payResponse)
      return res.status(500).json({ message: "Order creation failed" });

    res.status(200).json({
      message: "Order created successfully",
      orderId: payResponse.id,
      amount: payResponse.amount / 100, // Send amount in rupees
      currency: payResponse.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const paymentFetch = async (req, res) => {
  const { orderId } = req.body;

  try {
    const razorpayInstance = createRazorpayInstance();

    const payment = await razorpayInstance.payments.fetch(orderId);

    if (!payment) {
      return res.status(500).json("Error at razorpay loading");
    }

    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (error) {
    res.status(500).json("fail to fetch");
  }
};

export { createPaymentOrder };
