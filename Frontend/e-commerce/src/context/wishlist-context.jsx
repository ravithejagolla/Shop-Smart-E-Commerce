import { createContext, useContext, useReducer } from "react";

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case "REMOVE_FROM_WISHLIST":
      return { ...state, wishlist: state.wishlist.filter(item => item.id !== action.payload.id) };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const initialState = {
    wishlist: [],
  };

  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  return (
    <WishlistContext.Provider value={{ wishlist: state.wishlist, wishlistdispatch: dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const UseWishlist = () => useContext(WishlistContext);
