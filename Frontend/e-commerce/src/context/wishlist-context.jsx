// import { createContext, useContext, useReducer, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast"; // For user notifications

// // Create context
// const WishlistContext = createContext();

// // Define initial state
// const initialState = {
//   wishlist: [],
//   loading: false,
//   error: null,
// };

// // Action types
// const ACTIONS = {
//   SET_LOADING: "SET_LOADING",
//   SET_ERROR: "SET_ERROR",
//   SET_WISHLIST: "SET_WISHLIST",
//   ADD_TO_WISHLIST: "ADD_TO_WISHLIST",
//   REMOVE_FROM_WISHLIST: "REMOVE_FROM_WISHLIST",
//   CLEAR_WISHLIST: "CLEAR_WISHLIST",
// };

// // Reducer function to handle wishlist actions
// const wishlistReducer = (state, action) => {
//   switch (action.type) {
//     case ACTIONS.SET_LOADING:
//       return { ...state, loading: action.payload };

//     case ACTIONS.SET_ERROR:
//       return { ...state, error: action.payload };

//     case ACTIONS.SET_WISHLIST:
//       return { ...state, wishlist: action.payload, loading: false };

//     case ACTIONS.ADD_TO_WISHLIST:
//       // Check if product is already in wishlist
//       if (state.wishlist.some((item) => item.id === action.payload.id)) {
//         return state; // Don't add duplicates
//       }
//       return {
//         ...state,
//         wishlist: [...state.wishlist, action.payload],
//         loading: false,
//       };

//     case ACTIONS.REMOVE_FROM_WISHLIST:
//       return {
//         ...state,
//         wishlist: state.wishlist.filter((item) => item.id !== action.payload),
//         loading: false,
//       };

//     case ACTIONS.CLEAR_WISHLIST:
//       return { ...state, wishlist: [], loading: false };

//     default:
//       return state;
//   }
// };

// export const WishlistProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(wishlistReducer, initialState);

//   // Load wishlist from localStorage on initial render
//   useEffect(() => {
//     const loadWishlist = () => {
//       try {
//         dispatch({ type: ACTIONS.SET_LOADING, payload: true });
//         const storedWishlist = localStorage.getItem("wishlist");

//         if (storedWishlist) {
//           const parsedWishlist = JSON.parse(storedWishlist);
//           dispatch({ type: ACTIONS.SET_WISHLIST, payload: parsedWishlist });
//         }
//       } catch (error) {
//         console.error("Error loading wishlist from localStorage:", error);
//         dispatch({
//           type: ACTIONS.SET_ERROR,
//           payload: "Failed to load your wishlist",
//         });
//       }
//     };

//     loadWishlist();
//   }, []);

//   // Save wishlist to localStorage whenever it changes
//   useEffect(() => {
//     try {
//       localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
//     } catch (error) {
//       console.error("Error saving wishlist to localStorage:", error);
//     }
//   }, [state.wishlist]);

//   // Add item to wishlist
//   const addToWishlist = async (product) => {
//     dispatch({ type: ACTIONS.SET_LOADING, payload: true });

//     try {
//       // First check if product is already in wishlist
//       if (state.wishlist.some((item) => item.id === product.id)) {
//         toast.success("Product already in your wishlist");
//         dispatch({ type: ACTIONS.SET_LOADING, payload: false });
//         return;
//       }

//       // Get token to check if user is logged in
//       const token =
//         localStorage.getItem("token") || sessionStorage.getItem("token");

//       // If user is logged in, sync with server
//       if (token) {
//         try {
//           await axios.post(
//             "https://shop-smart-e-commerce.onrender.com/product/addToWishlist",
//             { productId: product.id },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//         } catch (error) {
//           // If it fails with a 400 and product already exists, continue
//           if (
//             !(
//               error.response &&
//               error.response.status === 400 &&
//               error.response.data.message === "User Already exist in Wishlist"
//             )
//           ) {
//             console.error("Error adding to server wishlist:", error);
//           }
//         }
//       }

//       // Always update local state
//       dispatch({ type: ACTIONS.ADD_TO_WISHLIST, payload: product });
//       toast.success("Added to wishlist successfully");
//     } catch (error) {
//       console.error("Error adding to wishlist:", error);
//       dispatch({
//         type: ACTIONS.SET_ERROR,
//         payload: "Failed to add item to wishlist. Please try again.",
//       });
//       toast.error("Failed to add to wishlist");
//     }
//   };

//   // Remove item from wishlist
//   const removeFromWishlist = async (productId) => {
//     dispatch({ type: ACTIONS.SET_LOADING, payload: true });

//     try {
//       // Get token to check if user is logged in
//       const token =
//         localStorage.getItem("token") || sessionStorage.getItem("token");

//       // If user is logged in, sync with server
//       if (token) {
//         try {
//           await axios.post(
//             "https://shop-smart-e-commerce.onrender.com/product/removeFromWishlist",
//             { productId },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//         } catch (error) {
//           console.error("Error removing from server wishlist:", error);
//         }
//       }

//       // Always update local state
//       dispatch({ type: ACTIONS.REMOVE_FROM_WISHLIST, payload: productId });
//       toast.success("Removed from wishlist");
//     } catch (error) {
//       console.error("Error removing from wishlist:", error);
//       dispatch({
//         type: ACTIONS.SET_ERROR,
//         payload: "Failed to remove item from wishlist. Please try again.",
//       });
//       toast.error("Failed to remove from wishlist");
//     }
//   };

//   // Clear the entire wishlist
//   const clearWishlist = async () => {
//     dispatch({ type: ACTIONS.SET_LOADING, payload: true });

//     try {
//       // Get token to check if user is logged in
//       const token =
//         localStorage.getItem("token") || sessionStorage.getItem("token");

//       // If user is logged in, sync with server
//       if (token) {
//         try {
//           await axios.post(
//             "https://shop-smart-e-commerce.onrender.com/product/clearWishlist",
//             {},
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//         } catch (error) {
//           console.error("Error clearing server wishlist:", error);
//         }
//       }

//       // Always update local state
//       dispatch({ type: ACTIONS.CLEAR_WISHLIST });
//       toast.success("Wishlist cleared");
//     } catch (error) {
//       console.error("Error clearing wishlist:", error);
//       dispatch({
//         type: ACTIONS.SET_ERROR,
//         payload: "Failed to clear wishlist. Please try again.",
//       });
//       toast.error("Failed to clear wishlist");
//     }
//   };

//   // Load wishlist from server (useful after login)
//   const fetchWishlistFromServer = async () => {
//     dispatch({ type: ACTIONS.SET_LOADING, payload: true });

//     try {
//       const token =
//         localStorage.getItem("token") || sessionStorage.getItem("token");

//       if (!token) {
//         dispatch({ type: ACTIONS.SET_LOADING, payload: false });
//         return;
//       }

//       const response = await axios.get(
//         "https://shop-smart-e-commerce.onrender.com/product/getWishlist",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data && Array.isArray(response.data)) {
//         dispatch({ type: ACTIONS.SET_WISHLIST, payload: response.data });
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist from server:", error);
//       dispatch({
//         type: ACTIONS.SET_ERROR,
//         payload: "Failed to load your wishlist. Please try again.",
//       });
//     }
//   };

//   // Check if a product is in the wishlist
//   const isInWishlist = (productId) => {
//     return state.wishlist.some((item) => item.id === productId);
//   };

//   return (
//     <WishlistContext.Provider
//       value={{
//         wishlist: state.wishlist,
//         loading: state.loading,
//         error: state.error,
//         addToWishlist,
//         removeFromWishlist,
//         clearWishlist,
//         fetchWishlistFromServer,
//         isInWishlist,
//       }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// // Custom hook for using the wishlist context
// export const UseWishlist = () => {
//   const context = useContext(WishlistContext);

//   if (!context) {
//     throw new Error("UseWishlist must be used within a WishlistProvider");
//   }

//   return context;
// };

// export default WishlistContext;

import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

// Create context
const WishlistContext = createContext();

// Initial state
const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_WISHLIST: "SET_WISHLIST",
  ADD_TO_WISHLIST: "ADD_TO_WISHLIST",
  REMOVE_FROM_WISHLIST: "REMOVE_FROM_WISHLIST",
  CLEAR_WISHLIST: "CLEAR_WISHLIST",
};

// Reducer function to handle wishlist actions
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.SET_WISHLIST:
      return { ...state, wishlist: action.payload, loading: false };

    case ACTIONS.ADD_TO_WISHLIST:
      // Check if product is already in wishlist
      if (state.wishlist.some((item) => item.id === action.payload.id)) {
        return state; // Don't add duplicates
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
        loading: false,
      };

    case ACTIONS.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload),
        loading: false,
      };

    case ACTIONS.CLEAR_WISHLIST:
      return { ...state, wishlist: [], loading: false };

    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    loadWishlist();

    // Listen for storage changes (to sync between tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle localStorage changes from other tabs/windows
  const handleStorageChange = (e) => {
    if (e.key === "wishlist") {
      loadWishlist();
    }
  };

  // Load wishlist from localStorage
  const loadWishlist = () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const storedWishlist = localStorage.getItem("wishlist");

      if (storedWishlist) {
        const parsedWishlist = JSON.parse(storedWishlist);
        dispatch({ type: ACTIONS.SET_WISHLIST, payload: parsedWishlist });
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to load your wishlist",
      });
    }
  };

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));

      // Dispatch a custom event that components can listen for
      const event = new CustomEvent("wishlistUpdated", {
        detail: { count: state.wishlist.length },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  }, [state.wishlist]);

  // Add item to wishlist
  const addToWishlist = async (product) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      // First check if product is already in wishlist
      if (state.wishlist.some((item) => item.id === product.id)) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return;
      }

      // Get token to check if user is logged in
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // If user is logged in, sync with server
      if (token) {
        try {
          await axios.post(
            "https://shop-smart-e-commerce.onrender.com/product/addToWishlist",
            { productId: product.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          // If it fails with a 400 and product already exists, continue
          if (
            !(
              error.response &&
              error.response.status === 400 &&
              error.response.data.message === "User Already exist in Wishlist"
            )
          ) {
            console.error("Error adding to server wishlist:", error);
          }
        }
      }

      // Always update local state
      dispatch({ type: ACTIONS.ADD_TO_WISHLIST, payload: product });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to add item to wishlist. Please try again.",
      });
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      // Get token to check if user is logged in
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // If user is logged in, sync with server
      if (token) {
        try {
          await axios.post(
            "https://shop-smart-e-commerce.onrender.com/product/removewishlist",
            { productId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error("Error removing from server wishlist:", error);
        }
      }

      // Always update local state
      dispatch({ type: ACTIONS.REMOVE_FROM_WISHLIST, payload: productId });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to remove item from wishlist. Please try again.",
      });
    }
  };

  // Clear the entire wishlist
  const clearWishlist = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      // Get token to check if user is logged in
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // If user is logged in, sync with server
      if (token) {
        try {
          await axios.post(
            "https://shop-smart-e-commerce.onrender.com/product/clearWishlist",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error("Error clearing server wishlist:", error);
        }
      }

      // Always update local state
      dispatch({ type: ACTIONS.CLEAR_WISHLIST });
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to clear wishlist. Please try again.",
      });
    }
  };

  // Load wishlist from server (useful after login)
  const fetchWishlistFromServer = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return;
      }

      const response = await axios.get(
        "https://shop-smart-e-commerce.onrender.com/user/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        dispatch({ type: ACTIONS.SET_WISHLIST, payload: response.data });
      }
    } catch (error) {
      console.error("Error fetching wishlist from server:", error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to load your wishlist. Please try again.",
      });
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return state.wishlist.some((item) => item.id === productId);
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return state.wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist: state.wishlist,
        wishlistCount: state.wishlist.length, // Expose count directly
        loading: state.loading,
        error: state.error,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        fetchWishlistFromServer,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook for using the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
};

export default WishlistContext;
