// src/api/wishlistApi.js

export const addToWishlistApi = async (productId, token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/product/addToWishlist`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    }
  );
  if (!response.ok) {
    // Try to parse error message
    let errorMsg = "Failed to add to wishlist";
    try {
      const data = await response.json();
      if (data && data.message === "User Already exist in Wishlist") {
        return { alreadyExists: true };
      }
      if (data && data.message) errorMsg = data.message;
    } catch {
      /* ignore JSON parse error */
    }
    throw new Error(errorMsg);
  }
  return response.json();
};

export const removeFromWishlistApi = async (productId, token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/product/removewishlist`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to remove from wishlist");
  }
  return response.json();
};
