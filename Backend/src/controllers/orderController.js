import { Order } from "../models/Order.js";
import { Product } from "../models/product.js";

// Create an Order
export const createOrder = async (req, res) => {
  const { products } = req.body;
  try {
    const userId = req.user.userId;// Assuming the user is authenticated
    console.log(userId)
    const orderProducts = [];

    let totalAmount = 0;

    // Calculate total amount and check product availability
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.title}` });
      }

      totalAmount += product.price * item.quantity;

      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Update the stock of the product
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      userId:userId,
      products: orderProducts,
      totalAmount,
    });
    console.log(newOrder);
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// Get Orders for User
export const getOrdersForUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.find({ userId }).populate("products.productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Get Order by ID (Admin)
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate("products.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow changing status to valid next states
    const validStatuses = ["pending", "paid", "shipped", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
};
export const getAllOrders = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
      }
  
      const orders = await Order.find()
        .populate("products.productId")
        .populate("userId", "username email");
  
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
  };
  export const getOrdersByStatus = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
      }
  
      const { status } = req.query;
  
      // Validate status
      const validStatuses = ["pending", "paid", "shipped", "delivered", "canceled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid order status" });
      }
  
      const orders = await Order.find({ status })
        .populate("products.productId")
        .populate("userId", "username email");
  
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders by status", error: error.message });
    }
  };