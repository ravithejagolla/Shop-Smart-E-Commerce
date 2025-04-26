// utilites/totalProductPrice.js

export const TotalAmmount = (cart) => {
    return cart.reduce((total, item) => {
      return total + item.price * (item.quantity || 1);
    }, 0);
  };
  