import React from "react";

const QuantityButton = ({ handleDecrement, handleIncrement, product }) => {
  return (
    <div className="quantity-controls text-1/2xl">
      <button
        onClick={() => handleDecrement(product.id)}
        disabled={product.quantity === 1}
        className="text-gray-500"
      >
        -
      </button>
      <input
        type="number"
        value={product.quantity}
        className="w-10 text-gray-700"
        readOnly
      />
      <button
        onClick={() => handleIncrement(product.id)}
        className="text-gray-500"
      >
        +
      </button>
    </div>
  );
};

export default QuantityButton;
