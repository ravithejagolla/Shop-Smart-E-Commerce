import { createContext, useContext, useReducer } from "react";
import { CartReducer } from "../Reduser/cart-reduser";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const initialState = {
    cart: []
  };

  const [{ cart }, cartdispatch] = useReducer(CartReducer, initialState);

  // Add handlers for increment, decrement, remove
  const handleIncrement = (productId) => {
    cartdispatch({ type: "INCREMENT_QUANTITY", payload: productId });
  };

  const handleDecrement = (productId) => {
    cartdispatch({ type: "DECREMENT_QUANTITY", payload: productId });
  };

  const removeFromCart = (productId) => {
    cartdispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  return (
    <CartContext.Provider value={{ cart, cartdispatch, handleIncrement, handleDecrement, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

const UseCart = () => useContext(CartContext);

export { CartProvider, UseCart };
