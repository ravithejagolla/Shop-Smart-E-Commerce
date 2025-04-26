import { UseCart } from "../../context/cart-context";
import { TotalAmmount } from "../../utilites/totalProductPrice";
import { useNavigate } from "react-router-dom"; 

export const PriceDetails = () => {
  const { cart } = UseCart();
  const navigate = useNavigate();
  const totalProductPrice = TotalAmmount(cart);
  const deliveryCharge = 49;

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_ksA7ruCXgK9Zua", 
      amount: (totalProductPrice + deliveryCharge) * 100, 
      currency: "INR",
      name: "Shop It",
      description: "Thank you for shopping with us",
      image: "https://thewrightfit.netlify.app/assets/The%20Wright%20Fit-logos.jpeg", 
      handler: function (response) {
        console.log(response);
        navigate("/order-success"); 
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Test address",
      },
      theme: {
        color: "#38a169",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <div className="w-[300px] flex flex-col gap-5 mt-20 shadow-2xs p-4 bg-white rounded-lg">
        <h3 className="text-xl font-bold mb-4">Price Details</h3>

        <div className="flex justify-between">
          <p>Price ({cart.length} items)</p>
          <p>₹{totalProductPrice}</p>
        </div>

        <div className="flex justify-between">
          <p>Delivery Charges</p>
          <p>₹{deliveryCharge}</p>
        </div>

        <div className="flex justify-between font-semibold text-lg mt-2">
          <p>Total Amount</p>
          <p>₹{totalProductPrice + deliveryCharge}</p>
        </div>

        <button
          onClick={displayRazorpay}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md mt-4"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};











//rzp_test_ksA7ruCXgK9Zua