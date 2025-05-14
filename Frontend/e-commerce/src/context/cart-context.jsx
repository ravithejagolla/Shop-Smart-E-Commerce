// cart-context.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";

// Create context
const CartContext = createContext();

// Action types as constants
const ACTIONS = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  SET_CART: "SET_CART",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SYNC_WITH_SERVER: "SYNC_WITH_SERVER",
};

// Initial state
const initialState = {
  cart: [],
  isLoading: false,
  error: null,
  lastSynced: null,
};

/**
 * Cart reducer function
 */
const cartReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART: {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        // Create a new cart array with the updated item
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity:
            (updatedCart[existingItemIndex].quantity || 1) +
            (action.payload.quantity || 1),
        };

        return {
          ...state,
          cart: updatedCart,
          error: null,
        };
      } else {
        return {
          ...state,
          cart: [
            ...state.cart,
            {
              ...action.payload,
              quantity: action.payload.quantity || 1,
            },
          ],
          error: null,
        };
      }
    }

    case ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
        error: null,
      };

    case ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;

      // Don't allow negative or zero quantities
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== id),
          error: null,
        };
      }

      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
        error: null,
      };
    }

    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: [],
        error: null,
      };

    case ACTIONS.SET_CART:
      return {
        ...state,
        cart: action.payload,
        isLoading: false,
        error: null,
        lastSynced: new Date().toISOString(),
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ACTIONS.SYNC_WITH_SERVER:
      return {
        ...state,
        lastSynced: new Date().toISOString(),
      };

    default:
      return state;
  }
};

// Safe localStorage functions
const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  },
};

// Provider component
export const CartProvider = ({ children }) => {
  // Load cart from localStorage on initial render
  const loadCartFromStorage = () => {
    const storedCart = safeLocalStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        return {
          cart: parsedCart.cart || [],
          isLoading: false,
          error: null,
          lastSynced: parsedCart.lastSynced || null,
        };
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    loadCartFromStorage
  );

  // Fetch cart from API (placeholder for future integration)
  const fetchCart = useCallback(async () => {
    // In the future, this will fetch cart from the API
    console.log("Fetching cart from API...");
    // For now, just return the cart from localStorage
    const savedState = loadCartFromStorage();
    if (savedState.cart.length > 0) {
      dispatch({ type: ACTIONS.SET_CART, payload: savedState.cart });
    }
  }, []);

  // Sync cart with server (placeholder for future integration)
  const syncCartWithServer = useCallback(() => {
    // In the future, this will sync cart with the server
    console.log("Syncing cart with server...");
    dispatch({ type: ACTIONS.SYNC_WITH_SERVER });
  }, []);

  // Initialize cart from localStorage (only once after initial render)
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Calculate cart totals
  const cartItemsCount = useMemo(
    () => state.cart.reduce((total, item) => total + (item.quantity || 1), 0),
    [state.cart]
  );

  const cartTotal = useMemo(
    () =>
      state.cart.reduce(
        (total, item) => total + (item.price * (item.quantity || 1) || 0),
        0
      ),
    [state.cart]
  );

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    safeLocalStorage.setItem(
      "cart",
      JSON.stringify({
        cart: state.cart,
        lastSynced: state.lastSynced,
      })
    );

    // Consider syncing with server in the future
    if (state.cart.length > 0) {
      syncCartWithServer();
    }
  }, [state.cart, syncCartWithServer, state.lastSynced]);

  // Action creators
  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({
      type: ACTIONS.ADD_TO_CART,
      payload: { ...product, quantity },
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({
      type: ACTIONS.REMOVE_FROM_CART,
      payload: productId,
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({
      type: ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity },
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  }, []);

  // Handlers for HorizontalCard component
  const handleIncrement = useCallback(
    (productId) => {
      const item = state.cart.find((item) => item.id === productId);
      if (item) {
        updateQuantity(productId, item.quantity + 1);
      }
    },
    [state.cart, updateQuantity]
  );

  const handleDecrement = useCallback(
    (productId) => {
      const item = state.cart.find((item) => item.id === productId);
      if (item && item.quantity > 1) {
        updateQuantity(productId, item.quantity - 1);
      } else if (item && item.quantity === 1) {
        // Optional: show confirmation before removing
        if (window.confirm("Remove this item from cart?")) {
          removeFromCart(productId);
        }
      }
    },
    [state.cart, updateQuantity, removeFromCart]
  );

  // Check if a product is in the cart
  const isInCart = useCallback(
    (productId) => {
      return state.cart.some((item) => item.id === productId);
    },
    [state.cart]
  );

  // Get item quantity from cart
  const getItemQuantity = useCallback(
    (productId) => {
      const item = state.cart.find((item) => item.id === productId);
      return item ? item.quantity : 0;
    },
    [state.cart]
  );

  // Provide all cart functionality
  const contextValue = useMemo(
    () => ({
      cart: state.cart,
      isLoading: state.isLoading,
      error: state.error,
      cartItemsCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart,
      isInCart,
      getItemQuantity,
      handleIncrement,
      handleDecrement,
      cartdispatch: dispatch, // Compatibility with existing code
    }),
    [
      state.cart,
      state.isLoading,
      state.error,
      cartItemsCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart,
      isInCart,
      getItemQuantity,
      handleIncrement,
      handleDecrement,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// PropTypes for CartProvider
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Export for backward compatibility with existing code that uses UseCart
export const UseCart = useCart;

// Export the CartProvider as the default export
export default useCart;
