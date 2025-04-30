import React, { createContext, useContext, useReducer, useEffect } from "react";

// Create context
const CartContext = createContext();

// Initial state
const initialState = {
  cart: [],
};

// Reducer function to handle cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
        };
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};

// Provider component
export const CartProvider = ({ children }) => {
  // Load cart from localStorage on initial render
  const loadCartFromStorage = () => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : initialState;
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return initialState;
    }
  };

  const [state, dispatch] = useReducer(cartReducer, loadCartFromStorage());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [state]);

  return (
    <CartContext.Provider value={{ cart: state.cart, cartdispatch: dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart context
export const UseCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("UseCart must be used within a CartProvider");
  }
  return context;
};
