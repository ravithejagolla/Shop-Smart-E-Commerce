// totalProductPrice.js
// Rename export to match both naming conventions used in the application

// This function calculates the total price of all items in the cart
export const calculateTotalAmount = (cart) => {
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return 0;
  }

  return cart.reduce((total, item) => {
    // Handle different price formats and ensure we have numbers
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^\d.]/g, ""))
        : item.price || 0;

    const quantity = item.quantity || 1;

    return total + price * quantity;
  }, 0);
};

// Export with alternative name for backward compatibility
export const TotalAmmount = calculateTotalAmount;
