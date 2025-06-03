import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id} style={{ marginBottom: "1rem" }}>
            <div>
              <strong>Order ID:</strong> {order._id}
            </div>
            <div>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Status:</strong> {order.status}
            </div>
            <div>
              <strong>Total:</strong> ₹{order.totalAmount}
            </div>
            <div>
              <strong>Products:</strong>
              <ul>
                {order.products.map((item, idx) => (
                  <li key={idx}>
                    {item.productId?.title || item.productId} x {item.quantity}{" "}
                    @ ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
