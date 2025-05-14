// Pages/Checkout.jsx
import React from "react";
import { useCart } from "../context/cart-context";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process payment logic here

    // On successful payment
    navigate("/order-success");
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>

      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <p>
              {item.name} x {item.quantity}
            </p>
            <p>${item.price * item.quantity}</p>
          </div>
        ))}
        <div className="total">
          <h3>Total</h3>
          <h3>${totalPrice}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Shipping Information</h2>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" required />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" required />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input type="text" id="city" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input type="text" id="state" required />
          </div>

          <div className="form-group">
            <label htmlFor="zip">ZIP Code</label>
            <input type="text" id="zip" required />
          </div>
        </div>

        <h2>Payment Information</h2>

        <div className="form-group">
          <label htmlFor="card">Card Number</label>
          <input type="text" id="card" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiry">Expiry Date</label>
            <input type="text" id="expiry" placeholder="MM/YY" required />
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input type="text" id="cvv" required />
          </div>
        </div>

        <button type="submit" className="place-order-btn">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;
