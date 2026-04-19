import { User } from "../models/User.js";
import Stripe from "stripe";

const createStripeCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    let cartSource = [];
    let isFrontendCart = false;

    if (req.body && req.body.cart && req.body.cart.length > 0) {
      cartSource = req.body.cart;
      isFrontendCart = true;
    } else {
      const userFetch = await User.findById(userId).populate({
        path: "cart.productId",
        model: "Product",
        select: "title price stock",
      });

      if (!userFetch || userFetch.cart.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      cartSource = userFetch.cart;
    }

    let line_items = [];
    let productsTotal = 0;

    for (const item of cartSource) {
      let title, price, quantity;

      if (isFrontendCart) {
        title = item.title;
        price = item.price;
        quantity = item.quantity || 1;
      } else {
        if (!item.productId || item.productId.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${item.productId?.title || 'product'}` });
        }
        title = item.productId.title;
        price = item.productId.price;
        quantity = item.quantity;
      }

      if (!title || price === undefined) {
         return res.status(400).json({ message: "Invalid product data in cart" });
      }

      productsTotal += (price * quantity);

      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: title,
          },
          unit_amount: Math.round(price * 100), // amount in paisa
        },
        quantity: quantity,
      });
    }

    // Add shipping fee if applicable (matching frontend's flat fee of 49)
    if (line_items.length > 0) {
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Shipping Fee',
          },
          unit_amount: 4900, // 49 INR * 100
        },
        quantity: 1,
      });

      // Optionally add Tax (5%) as frontend did, but simpler to let it just match the order subtotal
      let taxAmount = Math.round(productsTotal * 0.05);
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Tax (5%)',
          },
          unit_amount: Math.round(taxAmount * 100),
        },
        quantity: 1,
      });
    }

    const { origin } = req.headers;
    const frontendUrl = origin || "http://localhost:5173";

    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("Please set STRIPE_SECRET_KEY in your .env file!");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: line_items,
      success_url: `${frontendUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cart`,
      client_reference_id: userId.toString()
    });

    res.status(200).json({
      message: "Session created successfully",
      id: session.id,
      url: session.url
    });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export { createStripeCheckoutSession };
