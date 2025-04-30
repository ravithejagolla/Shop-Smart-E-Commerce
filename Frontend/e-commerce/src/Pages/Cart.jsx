// // import { Navbar } from "../components/Navbar";
// // import { PriceDetails } from "../components/PriceDetails/Price";
// // import { HorizontalCard } from "../components/ProductCard/HoriZontalCard";
// // import { UseCart } from "../context/cart-context";
// // import { Link } from "react-router-dom";
// // import { Footer } from "../components/Footer/footer";
// // import { useNavigate } from "react-router-dom";

// // // This component represents an enhanced cart item card
// // const EnhancedCartItem = ({ product }) => {
// //   const { cartdispatch } = UseCart();

// //   const handleRemoveItem = () => {
// //     cartdispatch({
// //       type: "REMOVE_FROM_CART",
// //       payload: product.id,
// //     });
// //   };

// //   const handleQuantityChange = (newQuantity) => {
// //     if (newQuantity < 1) {
// //       handleRemoveItem();
// //       return;
// //     }
// //     cartdispatch({
// //       type: "UPDATE_QUANTITY",
// //       payload: {
// //         id: product.id,
// //         quantity: newQuantity,
// //       },
// //     });
// //   };

// //   return (
// //     <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
// //       {/* Product Image */}
// //       <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-md flex-shrink-0 overflow-hidden">
// //         <img
// //           src={product.images[0]}
// //           alt={product.title}
// //           className="w-full h-full object-contain"
// //         />
// //       </div>

// //       {/* Product Details */}
// //       <div className="flex-grow flex flex-col sm:flex-row">
// //         <div className="flex-grow pr-3">
// //           <div className="flex justify-between">
// //             <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
// //               {product.title}
// //             </h3>
// //             <p className="font-bold text-indigo-600 ml-2 sm:hidden">
// //               {product.price ? `₹${product.price}` : "N/A"}
// //             </p>
// //           </div>

// //           {product.category && (
// //             <p className="text-sm text-gray-500 mb-2">{product.category}</p>
// //           )}

// //           {/* Product Attributes */}
// //           <div className="flex flex-wrap gap-2 mb-3">
// //             {product.color && (
// //               <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
// //                 Color: {product.color}
// //               </span>
// //             )}
// //             {product.size && (
// //               <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
// //                 Size: {product.size}
// //               </span>
// //             )}
// //           </div>

// //           {/* Actions */}
// //           <div className="flex items-center gap-4 mt-auto">
// //             {/* Quantity Selector */}
// //             <div className="flex items-center">
// //               {/* Decrease */}
// //               <button
// //                 onClick={() =>
// //                   handleQuantityChange((product.quantity || 1) - 1)
// //                 }
// //                 className="w-8 h-8 flex items-center justify-center rounded-l border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
// //               >
// //                 <span className="material-symbols-outlined text-sm">
// //                   remove
// //                 </span>
// //               </button>

// //               {/* Quantity Display */}
// //               <input
// //                 type="text"
// //                 value={product.quantity || 1}
// //                 readOnly
// //                 className="w-10 h-8 border-t border-b border-gray-300 text-center text-sm"
// //               />

// //               {/* Increase */}
// //               <button
// //                 onClick={() =>
// //                   handleQuantityChange((product.quantity || 1) + 1)
// //                 }
// //                 className="w-8 h-8 flex items-center justify-center rounded-r border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
// //               >
// //                 <span className="material-symbols-outlined text-sm">add</span>
// //               </button>
// //             </div>

// //             {/* Remove Button */}
// //             <button
// //               onClick={handleRemoveItem}
// //               className="text-sm text-rose-600 hover:text-rose-700 hover:underline flex items-center"
// //             >
// //               <span className="material-symbols-outlined text-sm mr-1">
// //                 delete
// //               </span>
// //               Remove
// //             </button>

// //             {/* Save for Later */}
// //             <button className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline flex items-center">
// //               <span className="material-symbols-outlined text-sm mr-1">
// //                 favorite
// //               </span>
// //               Save
// //             </button>
// //           </div>
// //         </div>

// //         {/* Price */}
// //         <div className="hidden sm:block text-right min-w-[100px]">
// //           <p className="font-bold text-indigo-600">
// //             {product.price ? `₹${product.price}` : "N/A"}
// //           </p>
// //           {product.originalPrice && (
// //             <p className="text-sm text-gray-500 line-through">{`₹${product.originalPrice}`}</p>
// //           )}
// //           {product.originalPrice && (
// //             <p className="text-xs text-green-600 font-medium">
// //               {Math.round((1 - product.price / product.originalPrice) * 100)}%
// //               off
// //             </p>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export const Cart = () => {
// //   const { cart } = UseCart();
// //   const navigate = useNavigate();
// //   const deliveryCharge = 0; // You can change this if needed

// //   const loadScript = (src) => {
// //     return new Promise((resolve) => {
// //       const script = document.createElement("script");
// //       script.src = src;
// //       script.onload = () => resolve(true);
// //       script.onerror = () => resolve(false);
// //       document.body.appendChild(script);
// //     });
// //   };

// //   const displayRazorpay = async () => {
// //     const res = await loadScript(
// //       "https://checkout.razorpay.com/v1/checkout.js"
// //     );

// //     if (!res) {
// //       alert("Razorpay SDK failed to load. Are you online?");
// //       return;
// //     }

// //     const totalPrice = cart.reduce(
// //       (total, item) => total + item.price * (item.quantity || 1),
// //       0
// //     );
// //     const tax = Math.round(totalPrice * 0.05);
// //     const finalAmount = totalPrice + tax + deliveryCharge;

// //     const options = {
// //       key: "rzp_test_ksA7ruCXgK9Zua", // Replace with your live key in production
// //       amount: finalAmount * 100, // in paisa
// //       currency: "INR",
// //       name: "Shop It",
// //       description: "Thank you for shopping with us",
// //       image:
// //         "https://thewrightfit.netlify.app/assets/The%20Wright%20Fit-logos.jpeg",
// //       handler: function (response) {
// //         console.log(response);
// //         cartdispatch({ type: "CLEAR_CART" });
// //         navigate("/order-success");
// //       },
// //       prefill: {
// //         name: "Test User",
// //         email: "test@example.com",
// //         contact: "9999999999",
// //       },
// //       notes: {
// //         address: "Test address",
// //       },
// //       theme: {
// //         color: "#4F46E5", // Indigo
// //       },
// //     };

// //     const paymentObject = new window.Razorpay(options);
// //     paymentObject.open();
// //   };

// //   return (
// //     <div className="flex flex-col min-h-screen bg-gray-50">
// //       <Navbar />x
// //       <div className="pt-20 flex-grow">
// //         <div className="max-w-6xl mx-auto px-4 py-6">
// //           {/* Breadcrumb Navigation */}
// //           <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
// //             <ol className="inline-flex items-center space-x-1 md:space-x-3">
// //               <li className="inline-flex items-center">
// //                 <Link
// //                   to="/"
// //                   className="text-gray-600 hover:text-indigo-600 transition-colors inline-flex items-center"
// //                 >
// //                   <span className="material-symbols-outlined text-sm mr-1">
// //                     home
// //                   </span>
// //                   Home
// //                 </Link>
// //               </li>
// //               <li>
// //                 <div className="flex items-center">
// //                   <span className="text-gray-400 mx-2">/</span>
// //                   <span className="text-indigo-600">Cart</span>
// //                 </div>
// //               </li>
// //             </ol>
// //           </nav>

// //           {/* Cart Title */}
// //           <div className="pb-4 mb-6">
// //             <h1 className="text-2xl font-bold text-gray-900">
// //               {cart && cart.length > 0
// //                 ? `Your Shopping Cart (${cart.length} item${
// //                     cart.length > 1 ? "s" : ""
// //                   })`
// //                 : "Your Shopping Cart"}
// //             </h1>
// //           </div>

// //           {/* Main Content */}
// //           {cart && cart.length > 0 ? (
// //             <div className="flex flex-col lg:flex-row gap-8">
// //               {/* Cart Items Section */}
// //               <div className="flex-1">
// //                 <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// //                   {cart.map((product, index) => (
// //                     <div key={product.id}>
// //                       <EnhancedCartItem product={product} />
// //                       {index < cart.length - 1 && (
// //                         <div className="border-b border-gray-100"></div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {/* Continue Shopping Button */}
// //                 <div className="mt-6 flex">
// //                   <Link
// //                     to="/"
// //                     className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
// //                   >
// //                     <span className="material-symbols-outlined text-sm mr-2">
// //                       arrow_back
// //                     </span>
// //                     Continue Shopping
// //                   </Link>
// //                 </div>
// //               </div>

// //               {/* Price Details Section (Order Summary) */}
// //               <div className="lg:w-96">
// //                 <div className="sticky top-24">
// //                   <div className="bg-white rounded-lg shadow-sm p-6">
// //                     <h2 className="text-lg font-semibold text-gray-900 mb-4">
// //                       Order Summary
// //                     </h2>

// //                     <div className="space-y-3 mb-4">
// //                       <div className="flex justify-between">
// //                         <span className="text-gray-600">
// //                           Subtotal ({cart.length} item
// //                           {cart.length > 1 ? "s" : ""})
// //                         </span>
// //                         <span className="font-medium">
// //                           ₹
// //                           {cart.reduce(
// //                             (total, item) =>
// //                               total + item.price * (item.quantity || 1),
// //                             0,
// //                             2
// //                           )}
// //                         </span>
// //                       </div>
// //                       <div className="flex justify-between">
// //                         <span className="text-gray-600">Shipping</span>
// //                         <span className="font-medium text-green-600">Free</span>
// //                       </div>
// //                       <div className="flex justify-between">
// //                         <span className="text-gray-600">Tax</span>
// //                         <span className="font-medium">
// //                           ₹
// //                           {Math.round(
// //                             cart.reduce(
// //                               (total, item) =>
// //                                 total + item.price * (item.quantity || 1),
// //                               0
// //                             ) * 0.05
// //                           )}
// //                         </span>
// //                       </div>
// //                       <div className="border-t pt-3 mt-3">
// //                         <div className="flex justify-between">
// //                           <span className="font-semibold">Total</span>
// //                           <span className="font-bold text-indigo-600">
// //                             ₹
// //                             {Math.round(
// //                               cart.reduce(
// //                                 (total, item) =>
// //                                   total + item.price * (item.quantity || 1),
// //                                 0
// //                               ) * 1.05,
// //                               2
// //                             )}
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Coupon Code */}
// //                     <div className="mb-4">
// //                       <div className="flex">
// //                         <input
// //                           type="text"
// //                           placeholder="Enter coupon code"
// //                           className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
// //                         />
// //                         <button className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-r-md font-medium hover:bg-indigo-200 transition-colors">
// //                           Apply
// //                         </button>
// //                       </div>
// //                     </div>

// //                     {/* Checkout Button */}
// //                     <button
// //                       onClick={displayRazorpay}
// //                       className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
// //                     >
// //                       <span className="material-symbols-outlined text-sm mr-2">
// //                         shopping_cart_checkout
// //                       </span>
// //                       Proceed to Checkout
// //                     </button>
// //                   </div>

// //                   {/* Payment Methods */}
// //                   <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
// //                     <p className="text-sm text-gray-600 mb-3">We Accept:</p>
// //                     <div className="flex items-center gap-3">
// //                       <img
// //                         src="https://cdn-icons-png.flaticon.com/128/196/196578.png"
// //                         alt="Visa"
// //                         className="h-8 w-auto opacity-70"
// //                       />
// //                       <img
// //                         src="https://cdn-icons-png.flaticon.com/128/196/196561.png"
// //                         alt="MasterCard"
// //                         className="h-8 w-auto opacity-70"
// //                       />
// //                       <img
// //                         src="https://cdn-icons-png.flaticon.com/128/196/196539.png"
// //                         alt="PayPal"
// //                         className="h-8 w-auto opacity-70"
// //                       />
// //                       <img
// //                         src="https://cdn-icons-png.flaticon.com/128/5968/5968416.png"
// //                         alt="GPay"
// //                         className="h-8 w-auto opacity-70"
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ) : (
// //             /* Empty Cart State */
// //             <div className="text-center py-16 bg-white rounded-lg shadow-sm">
// //               <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
// //                 <span className="material-symbols-outlined text-6xl text-gray-400">
// //                   shopping_cart
// //                 </span>
// //               </div>
// //               <h2 className="text-2xl font-semibold text-gray-800 mb-3">
// //                 Your cart is empty
// //               </h2>
// //               <p className="text-gray-600 mb-8 max-w-md mx-auto">
// //                 Looks like you haven't added anything to your cart yet. Browse
// //                 our products and find something you'll love!
// //               </p>
// //               <Link
// //                 to="/"
// //                 className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
// //               >
// //                 Start Shopping
// //               </Link>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //       <Footer />
// //     </div>
// //   );
// // };

// // import { Navbar } from "../components/Navbar";
// // import { UseCart } from "../context/cart-context";
// // import { Link, useNavigate } from "react-router-dom";
// // import { Footer } from "../components/Footer/footer";

// // const EnhancedCartItem = ({ product }) => {
// //   const { cartdispatch } = UseCart();

// //   const handleRemoveItem = () => {
// //     cartdispatch({
// //       type: "REMOVE_FROM_CART",
// //       payload: product.id,
// //     });
// //   };

// //   const handleQuantityChange = (newQuantity) => {
// //     if (newQuantity < 1) {
// //       handleRemoveItem();
// //       return;
// //     }
// //     cartdispatch({
// //       type: "UPDATE_QUANTITY",
// //       payload: {
// //         id: product.id,
// //         quantity: newQuantity,
// //       },
// //     });
// //   };

// //   return (
// //     <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
// //       <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-md overflow-hidden">
// //         <img
// //           src={product.images[0]}
// //           alt={product.title}
// //           className="w-full h-full object-contain"
// //         />
// //       </div>

// //       <div className="flex-grow flex flex-col sm:flex-row">
// //         <div className="flex-grow pr-3">
// //           <div className="flex justify-between">
// //             <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
// //               {product.title}
// //             </h3>
// //             <p className="font-bold text-indigo-600 ml-2 sm:hidden">
// //               {product.price ? `₹${product.price}` : "N/A"}
// //             </p>
// //           </div>

// //           {product.category && (
// //             <p className="text-sm text-gray-500 mb-2">{product.category}</p>
// //           )}

// //           <div className="flex flex-wrap gap-2 mb-3">
// //             {product.color && (
// //               <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
// //                 Color: {product.color}
// //               </span>
// //             )}
// //             {product.size && (
// //               <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
// //                 Size: {product.size}
// //               </span>
// //             )}
// //           </div>

// //           <div className="flex items-center gap-4 mt-auto">
// //             <div className="flex items-center">
// //               <button
// //                 onClick={() =>
// //                   handleQuantityChange((product.quantity || 1) - 1)
// //                 }
// //                 className="w-8 h-8 flex items-center justify-center rounded-l border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
// //               >
// //                 <span className="material-symbols-outlined text-sm">
// //                   remove
// //                 </span>
// //               </button>

// //               <input
// //                 type="text"
// //                 value={product.quantity || 1}
// //                 readOnly
// //                 className="w-10 h-8 border-t border-b border-gray-300 text-center text-sm"
// //               />

// //               <button
// //                 onClick={() =>
// //                   handleQuantityChange((product.quantity || 1) + 1)
// //                 }
// //                 className="w-8 h-8 flex items-center justify-center rounded-r border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
// //               >
// //                 <span className="material-symbols-outlined text-sm">add</span>
// //               </button>
// //             </div>

// //             <button
// //               onClick={handleRemoveItem}
// //               className="text-sm text-rose-600 hover:text-rose-700 hover:underline flex items-center"
// //             >
// //               <span className="material-symbols-outlined text-sm mr-1">
// //                 delete
// //               </span>
// //               Remove
// //             </button>

// //             <button className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline flex items-center">
// //               <span className="material-symbols-outlined text-sm mr-1">
// //                 favorite
// //               </span>
// //               Save
// //             </button>
// //           </div>
// //         </div>

// //         <div className="hidden sm:block text-right min-w-[100px]">
// //           <p className="font-bold text-indigo-600">
// //             {product.price ? `₹${product.price}` : "N/A"}
// //           </p>
// //           {product.originalPrice && (
// //             <>
// //               <p className="text-sm text-gray-500 line-through">
// //                 ₹{product.originalPrice}
// //               </p>
// //               <p className="text-xs text-green-600 font-medium">
// //                 {Math.round((1 - product.price / product.originalPrice) * 100)}%
// //                 off
// //               </p>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export const Cart = () => {
// //   const { cart, cartdispatch } = UseCart(); // ✅ Added cartdispatch
// //   const navigate = useNavigate();
// //   const deliveryCharge = 0;

// //   const loadScript = (src) => {
// //     return new Promise((resolve) => {
// //       const script = document.createElement("script");
// //       script.src = src;
// //       script.onload = () => resolve(true);
// //       script.onerror = () => resolve(false);
// //       document.body.appendChild(script);
// //     });
// //   };

// //   const displayRazorpay = async () => {
// //     const res = await loadScript(
// //       "https://checkout.razorpay.com/v1/checkout.js"
// //     );

// //     if (!res) {
// //       alert("Razorpay SDK failed to load. Are you online?");
// //       return;
// //     }

// //     const totalPrice = cart.reduce(
// //       (total, item) => total + item.price * (item.quantity || 1),
// //       0
// //     );
// //     const tax = Math.round(totalPrice * 0.05);
// //     const finalAmount = totalPrice + tax + deliveryCharge;

// //     const options = {
// //       key: "rzp_test_ksA7ruCXgK9Zua",
// //       amount: finalAmount * 100,
// //       currency: "INR",
// //       name: "Shop It",
// //       description: "Thank you for shopping with us",
// //       image:
// //         "https://thewrightfit.netlify.app/assets/The%20Wright%20Fit-logos.jpeg",
// //       handler: function (response) {
// //         console.log(response);

// //         // ✅ Clear the cart
// //         cartdispatch({ type: "CLEAR_CART" });

// //         // ✅ Redirect after success
// //         navigate("/order-success");
// //       },
// //       prefill: {
// //         name: "Test User",
// //         email: "test@example.com",
// //         contact: "9999999999",
// //       },
// //       notes: {
// //         address: "Test address",
// //       },
// //       theme: {
// //         color: "#4F46E5",
// //       },
// //     };

// //     const paymentObject = new window.Razorpay(options);
// //     paymentObject.open();
// //   };

// //   return (
// //     <div className="flex flex-col min-h-screen bg-gray-50">
// //       <Navbar />

// //       <div className="pt-20 flex-grow">
// //         <div className="max-w-6xl mx-auto px-4 py-6">
// //           <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
// //             <ol className="inline-flex items-center space-x-1 md:space-x-3">
// //               <li className="inline-flex items-center">
// //                 <Link
// //                   to="/"
// //                   className="text-gray-600 hover:text-indigo-600 transition-colors inline-flex items-center"
// //                 >
// //                   <span className="material-symbols-outlined text-sm mr-1">
// //                     home
// //                   </span>
// //                   Home
// //                 </Link>
// //               </li>
// //               <li>
// //                 <div className="flex items-center">
// //                   <span className="text-gray-400 mx-2">/</span>
// //                   <span className="text-indigo-600">Cart</span>
// //                 </div>
// //               </li>
// //             </ol>
// //           </nav>

// //           <div className="pb-4 mb-6">
// //             <h1 className="text-2xl font-bold text-gray-900">
// //               {cart && cart.length > 0
// //                 ? `Your Shopping Cart (${cart.length} item${
// //                     cart.length > 1 ? "s" : ""
// //                   })`
// //                 : "Your Shopping Cart"}
// //             </h1>
// //           </div>

// //           {cart && cart.length > 0 ? (
// //             <div className="flex flex-col lg:flex-row gap-8">
// //               <div className="flex-1">
// //                 <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// //                   {cart.map((product, index) => (
// //                     <div key={product.id}>
// //                       <EnhancedCartItem product={product} />
// //                       {index < cart.length - 1 && (
// //                         <div className="border-b border-gray-100"></div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>

// //                 <div className="mt-6 flex">
// //                   <Link
// //                     to="/"
// //                     className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
// //                   >
// //                     <span className="material-symbols-outlined text-sm mr-2">
// //                       arrow_back
// //                     </span>
// //                     Continue Shopping
// //                   </Link>
// //                 </div>
// //               </div>

// //               <div className="lg:w-96">
// //                 <div className="sticky top-24">
// //                   <div className="bg-white rounded-lg shadow-sm p-6">
// //                     <h2 className="text-lg font-semibold text-gray-900 mb-4">
// //                       Order Summary
// //                     </h2>

// //                     <div className="space-y-3 mb-4">
// //                       <div className="flex justify-between">
// //                         <span className="text-gray-600">
// //                           Subtotal ({cart.length} item
// //                           {cart.length > 1 ? "s" : ""})
// //                         </span>
// //                         <span className="font-medium">
// //                           ₹
// //                           {cart.reduce(
// //                             (total, item) =>
// //                               total + item.price * (item.quantity || 1),
// //                             0
// //                           )}
// //                         </span>
// //                       </div>
// //                       <div className="flex justify-between">
// //                         <span className="text-gray-600">Shipping</span>
// //                         <span className="font-medium text-green-600">Free</span>
// //                       </div>
// //                       <div className="flex justify-between">
// //                         <span className="text-gray-600">Tax</span>
// //                         <span className="font-medium">
// //                           ₹
// //                           {Math.round(
// //                             cart.reduce(
// //                               (total, item) =>
// //                                 total + item.price * (item.quantity || 1),
// //                               0
// //                             ) * 0.05
// //                           )}
// //                         </span>
// //                       </div>
// //                       <div className="border-t pt-3 mt-3">
// //                         <div className="flex justify-between">
// //                           <span className="font-semibold">Total</span>
// //                           <span className="font-bold text-indigo-600">
// //                             ₹
// //                             {Math.round(
// //                               cart.reduce(
// //                                 (total, item) =>
// //                                   total + item.price * (item.quantity || 1),
// //                                 0
// //                               ) * 1.05
// //                             )}
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <button
// //                       onClick={displayRazorpay}
// //                       className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
// //                     >
// //                       <span className="material-symbols-outlined text-sm mr-2">
// //                         shopping_cart_checkout
// //                       </span>
// //                       Proceed to Checkout
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="text-center py-16 bg-white rounded-lg shadow-sm">
// //               <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
// //                 <span className="material-symbols-outlined text-6xl text-gray-400">
// //                   shopping_cart
// //                 </span>
// //               </div>
// //               <h2 className="text-2xl font-semibold text-gray-800 mb-3">
// //                 Your cart is empty
// //               </h2>
// //               <p className="text-gray-600 mb-8 max-w-md mx-auto">
// //                 Looks like you haven't added anything to your cart yet.
// //               </p>
// //               <Link
// //                 to="/"
// //                 className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
// //               >
// //                 Start Shopping
// //               </Link>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       <Footer />
// //     </div>
// //   );
// // };

// import { Navbar } from "../components/Navbar";
// import { UseCart } from "../context/cart-context";
// import { Link, useNavigate } from "react-router-dom";
// import { Footer } from "../components/Footer/footer";

// const EnhancedCartItem = ({ product }) => {
//   const { cartdispatch } = UseCart();

//   const handleRemoveItem = () => {
//     cartdispatch({
//       type: "REMOVE_FROM_CART",
//       payload: product.id,
//     });
//   };

//   const handleQuantityChange = (newQuantity) => {
//     if (newQuantity < 1) {
//       handleRemoveItem();
//       return;
//     }
//     cartdispatch({
//       type: "UPDATE_QUANTITY",
//       payload: {
//         id: product.id,
//         quantity: newQuantity,
//       },
//     });
//   };

//   return (
//     <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
//       <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-md overflow-hidden">
//         <img
//           src={product.images[0]}
//           alt={product.title}
//           className="w-full h-full object-contain"
//         />
//       </div>

//       <div className="flex-grow flex flex-col sm:flex-row">
//         <div className="flex-grow pr-3">
//           <div className="flex justify-between">
//             <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
//               {product.title}
//             </h3>
//             <p className="font-bold text-indigo-600 ml-2 sm:hidden">
//               {product.price ? `₹${product.price}` : "N/A"}
//             </p>
//           </div>

//           {product.category && (
//             <p className="text-sm text-gray-500 mb-2">{product.category}</p>
//           )}

//           <div className="flex flex-wrap gap-2 mb-3">
//             {product.color && (
//               <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
//                 Color: {product.color}
//               </span>
//             )}
//             {product.size && (
//               <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
//                 Size: {product.size}
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-4 mt-auto">
//             <div className="flex items-center">
//               <button
//                 onClick={() =>
//                   handleQuantityChange((product.quantity || 1) - 1)
//                 }
//                 className="w-8 h-8 flex items-center justify-center rounded-l border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
//               >
//                 <span className="material-symbols-outlined text-sm">
//                   remove
//                 </span>
//               </button>

//               <input
//                 type="text"
//                 value={product.quantity || 1}
//                 readOnly
//                 className="w-10 h-8 border-t border-b border-gray-300 text-center text-sm"
//               />

//               <button
//                 onClick={() =>
//                   handleQuantityChange((product.quantity || 1) + 1)
//                 }
//                 className="w-8 h-8 flex items-center justify-center rounded-r border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
//               >
//                 <span className="material-symbols-outlined text-sm">add</span>
//               </button>
//             </div>

//             <button
//               onClick={handleRemoveItem}
//               className="text-sm text-rose-600 hover:text-rose-700 hover:underline flex items-center"
//             >
//               <span className="material-symbols-outlined text-sm mr-1">
//                 delete
//               </span>
//               Remove
//             </button>

//             <button className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline flex items-center">
//               <span className="material-symbols-outlined text-sm mr-1">
//                 favorite
//               </span>
//               Save
//             </button>
//           </div>
//         </div>

//         <div className="hidden sm:block text-right min-w-[100px]">
//           <p className="font-bold text-indigo-600">
//             {product.price ? `₹${product.price}` : "N/A"}
//           </p>
//           {product.originalPrice && (
//             <>
//               <p className="text-sm text-gray-500 line-through">
//                 ₹{product.originalPrice}
//               </p>
//               <p className="text-xs text-green-600 font-medium">
//                 {Math.round((1 - product.price / product.originalPrice) * 100)}%
//                 off
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export const Cart = () => {
//   const { cart, cartdispatch } = UseCart();
//   const navigate = useNavigate();
//   const deliveryCharge = 0;

//   // Check authentication status
//   const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

//   const loadScript = (src) => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = src;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const displayRazorpay = async () => {
//     // Check authentication before proceeding
//     if (!isAuthenticated) {
//       const shouldLogin = window.confirm(
//         "You need to login to proceed with checkout. Would you like to login now?"
//       );
//       if (shouldLogin) {
//         navigate("/login", { state: { from: "/cart" } });
//       }
//       return;
//     }

//     const res = await loadScript(
//       "https://checkout.razorpay.com/v1/checkout.js"
//     );

//     if (!res) {
//       alert("Razorpay SDK failed to load. Are you online?");
//       return;
//     }

//     const totalPrice = cart.reduce(
//       (total, item) => total + item.price * (item.quantity || 1),
//       0
//     );
//     const tax = Math.round(totalPrice * 0.05);
//     const finalAmount = totalPrice + tax + deliveryCharge;

//     const options = {
//       key: "rzp_test_ksA7ruCXgK9Zua",
//       amount: finalAmount * 100,
//       currency: "INR",
//       name: "Shop It",
//       description: "Thank you for shopping with us",
//       image:
//         "https://thewrightfit.netlify.app/assets/The%20Wright%20Fit-logos.jpeg",
//       handler: function (response) {
//         console.log(response);
//         cartdispatch({ type: "CLEAR_CART" });
//         navigate("/order-success");
//       },
//       prefill: {
//         name: "Test User",
//         email: "test@example.com",
//         contact: "9999999999",
//       },
//       notes: {
//         address: "Test address",
//       },
//       theme: {
//         color: "#4F46E5",
//       },
//     };

//     const paymentObject = new window.Razorpay(options);
//     paymentObject.open();
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Navbar />

//       <div className="pt-20 flex-grow">
//         <div className="max-w-6xl mx-auto px-4 py-6">
//           <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
//             <ol className="inline-flex items-center space-x-1 md:space-x-3">
//               <li className="inline-flex items-center">
//                 <Link
//                   to="/"
//                   className="text-gray-600 hover:text-indigo-600 transition-colors inline-flex items-center"
//                 >
//                   <span className="material-symbols-outlined text-sm mr-1">
//                     home
//                   </span>
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <div className="flex items-center">
//                   <span className="text-gray-400 mx-2">/</span>
//                   <span className="text-indigo-600">Cart</span>
//                 </div>
//               </li>
//             </ol>
//           </nav>

//           <div className="pb-4 mb-6">
//             <h1 className="text-2xl font-bold text-gray-900">
//               {cart && cart.length > 0
//                 ? `Your Shopping Cart (${cart.length} item${
//                     cart.length > 1 ? "s" : ""
//                   })`
//                 : "Your Shopping Cart"}
//             </h1>
//           </div>

//           {cart && cart.length > 0 ? (
//             <div className="flex flex-col lg:flex-row gap-8">
//               <div className="flex-1">
//                 <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                   {cart.map((product, index) => (
//                     <div key={product.id}>
//                       <EnhancedCartItem product={product} />
//                       {index < cart.length - 1 && (
//                         <div className="border-b border-gray-100"></div>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-6 flex">
//                   <Link
//                     to="/"
//                     className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
//                   >
//                     <span className="material-symbols-outlined text-sm mr-2">
//                       arrow_back
//                     </span>
//                     Continue Shopping
//                   </Link>
//                 </div>
//               </div>

//               <div className="lg:w-96">
//                 <div className="sticky top-24">
//                   <div className="bg-white rounded-lg shadow-sm p-6">
//                     <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                       Order Summary
//                     </h2>

//                     <div className="space-y-3 mb-4">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">
//                           Subtotal ({cart.length} item
//                           {cart.length > 1 ? "s" : ""})
//                         </span>
//                         <span className="font-medium">
//                           ₹
//                           {cart.reduce(
//                             (total, item) =>
//                               total + item.price * (item.quantity || 1),
//                             0
//                           )}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Shipping</span>
//                         <span className="font-medium text-green-600">Free</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Tax</span>
//                         <span className="font-medium">
//                           ₹
//                           {Math.round(
//                             cart.reduce(
//                               (total, item) =>
//                                 total + item.price * (item.quantity || 1),
//                               0
//                             ) * 0.05
//                           )}
//                         </span>
//                       </div>
//                       <div className="border-t pt-3 mt-3">
//                         <div className="flex justify-between">
//                           <span className="font-semibold">Total</span>
//                           <span className="font-bold text-indigo-600">
//                             ₹
//                             {Math.round(
//                               cart.reduce(
//                                 (total, item) =>
//                                   total + item.price * (item.quantity || 1),
//                                 0
//                               ) * 1.05
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Login reminder for unauthenticated users */}
//                     {!isAuthenticated && (
//                       <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
//                         You need to login to proceed with checkout.
//                       </div>
//                     )}

//                     <button
//                       onClick={displayRazorpay}
//                       className={`w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center ${
//                         isAuthenticated
//                           ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                           : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                       }`}
//                       disabled={!isAuthenticated}
//                     >
//                       <span className="material-symbols-outlined text-sm mr-2">
//                         shopping_cart_checkout
//                       </span>
//                       {isAuthenticated
//                         ? "Proceed to Checkout"
//                         : "Login to Checkout"}
//                     </button>

//                     {!isAuthenticated && (
//                       <div className="mt-4 text-center">
//                         <Link
//                           to="/login"
//                           state={{ from: "/cart" }}
//                           className="text-indigo-600 hover:text-indigo-700 font-medium"
//                         >
//                           Login to your account
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-16 bg-white rounded-lg shadow-sm">
//               <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
//                 <span className="material-symbols-outlined text-6xl text-gray-400">
//                   shopping_cart
//                 </span>
//               </div>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-3">
//                 Your cart is empty
//               </h2>
//               <p className="text-gray-600 mb-8 max-w-md mx-auto">
//                 Looks like you haven't added anything to your cart yet.
//               </p>
//               <Link
//                 to="/"
//                 className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
//               >
//                 Start Shopping
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// Updated Cart.jsx with improved authentication check

import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { UseCart } from "../context/cart-context";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer/footer";
import { TotalAmmount } from "../utilites/totalProductPrice";

// Enhanced Cart component with better authentication handling
export const Cart = () => {
  const { cart, cartdispatch } = UseCart();
  const navigate = useNavigate();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Calculate costs
  const subtotal = TotalAmmount(cart);
  const shippingFee = cart.length > 0 ? 49 : 0;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + tax + shippingFee;

  // IMPORTANT: Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Comprehensive authentication check function
  const checkAuthStatus = () => {
    // Check multiple sources to determine auth status
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const isLoggedInFlag = localStorage.getItem("isAuthenticated") === "true";
    const userData = localStorage.getItem("user");

    // Consider user authenticated if any of these are true
    const authenticated = !!(token || isLoggedInFlag || userData);

    console.log("Auth Check:", {
      token: !!token,
      isLoggedInFlag,
      hasUserData: !!userData,
      authenticated,
    });

    setIsAuthenticated(authenticated);
    setAuthChecked(true);

    // If we have token but not the isAuthenticated flag, set it
    if (token && !isLoggedInFlag) {
      localStorage.setItem("isAuthenticated", "true");
    }
  };

  // Handler for cart item quantity updates
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // Confirm before removing
      if (window.confirm("Remove this item from your cart?")) {
        cartdispatch({
          type: "REMOVE_FROM_CART",
          payload: productId,
        });
      }
      return;
    }

    cartdispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        id: productId,
        quantity: newQuantity,
      },
    });
  };

  // Handle item removal
  const handleRemoveItem = (productId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      cartdispatch({
        type: "REMOVE_FROM_CART",
        payload: productId,
      });
    }
  };

  // Razorpay payment setup
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle checkout process
  const handleCheckout = async () => {
    // Check if cart is empty
    if (cart.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    // Re-check authentication status
    checkAuthStatus();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      // Store the current location so we can redirect back after login
      localStorage.setItem("redirectAfterLogin", "/cart");

      if (window.confirm("You need to login to proceed. Go to login page?")) {
        navigate("/login");
      }
      return;
    }

    setIsProcessing(true);
    setMessage("");

    try {
      // Load Razorpay SDK
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        setMessage(
          "Payment gateway failed to load. Please check your connection."
        );
        setIsProcessing(false);
        return;
      }

      // Get user data (if available)
      const userData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {};

      // Configure Razorpay
      const options = {
        key: "rzp_test_ksA7ruCXgK9Zua",
        amount: total * 100, // in paisa
        currency: "INR",
        name: "RetailCanvas",
        description: `Payment for ${cart.length} item${
          cart.length > 1 ? "s" : ""
        }`,
        image:
          "https://thewrightfit.netlify.app/assets/The%20Wright%20Fit-logos.jpeg",
        handler: function (response) {
          // Payment successful
          handlePaymentSuccess(response);
        },
        prefill: {
          name: userData.username || "",
          email: userData.email || "",
          contact: userData.phone || "",
        },
        notes: {
          address: "RetailCanvas Headquarters",
        },
        theme: {
          color: "#4F46E5", // Indigo color
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      // Create Razorpay instance and open payment modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = (response) => {
    try {
      console.log("Payment successful:", response);

      // Clear cart
      cartdispatch({ type: "CLEAR_CART" });

      // Navigate to success page
      navigate("/order-success");
    } catch (error) {
      console.error("Error processing successful payment:", error);
      setMessage(
        "Payment was successful, but we couldn't process your order. Please contact support."
      );
      setIsProcessing(false);
    }
  };

  // Render cart items
  const renderCartItems = () => {
    return cart.map((product, index) => (
      <div key={product.id}>
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-md overflow-hidden">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/150"}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-grow flex flex-col sm:flex-row">
            <div className="flex-grow pr-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                  {product.title}
                </h3>
                <p className="font-bold text-indigo-600 ml-2 sm:hidden">
                  ₹{product.price}
                </p>
              </div>

              {product.category && (
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                {product.color && (
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    Color: {product.color}
                  </span>
                )}
                {product.size && (
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    Size: {product.size}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.id,
                        (product.quantity || 1) - 1
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-l border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  >
                    <span className="material-symbols-outlined text-sm">
                      remove
                    </span>
                  </button>

                  <input
                    type="text"
                    value={product.quantity || 1}
                    readOnly
                    className="w-10 h-8 border-t border-b border-gray-300 text-center text-sm"
                  />

                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.id,
                        (product.quantity || 1) + 1
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-r border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(product.id)}
                  className="text-sm text-rose-600 hover:text-rose-700 hover:underline flex items-center"
                >
                  <span className="material-symbols-outlined text-sm mr-1">
                    delete
                  </span>
                  Remove
                </button>
              </div>
            </div>

            <div className="hidden sm:block text-right min-w-[100px]">
              <p className="font-bold text-indigo-600">₹{product.price}</p>
              {product.originalPrice && (
                <>
                  <p className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100
                    )}
                    % off
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        {index < cart.length - 1 && (
          <div className="border-b border-gray-100"></div>
        )}
      </div>
    ));
  };

  // Login status loading view
  if (!authChecked) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-600 transition-colors inline-flex items-center"
                >
                  <span className="material-symbols-outlined text-sm mr-1">
                    home
                  </span>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-indigo-600">Cart</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Cart Title */}
          <div className="pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {cart && cart.length > 0
                ? `Your Shopping Cart (${cart.length} item${
                    cart.length > 1 ? "s" : ""
                  })`
                : "Your Shopping Cart"}
            </h1>
          </div>

          {/* Notification Message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.includes("failed") || message.includes("empty")
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Debug auth status - comment out in production */}
          {false && (
            <div className="mb-4 p-3 rounded-md bg-yellow-50 text-yellow-700">
              Auth Status: {isAuthenticated ? "Logged In" : "Not Logged In"}
            </div>
          )}

          {/* Main Content */}
          {cart && cart.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {renderCartItems()}
                </div>

                {/* Continue Shopping Button */}
                <div className="mt-6 flex">
                  <Link
                    to="/"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm mr-2">
                      arrow_back
                    </span>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="lg:w-96">
                <div className="sticky top-24">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Order Summary
                    </h2>

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Subtotal ({cart.length} item
                          {cart.length > 1 ? "s" : ""})
                        </span>
                        <span className="font-medium">₹{subtotal}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">₹{shippingFee}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (5%)</span>
                        <span className="font-medium">₹{tax}</span>
                      </div>

                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-indigo-600">
                            ₹{total}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className={`w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                        isProcessing
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm mr-2">
                            shopping_cart_checkout
                          </span>
                          Proceed to Checkout
                        </>
                      )}
                    </button>

                    {/* Authentication Notice */}
                    {!isAuthenticated && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                        <p className="text-sm text-yellow-800 text-center">
                          You need to be logged in to checkout.
                          <Link
                            to="/login"
                            className="font-medium ml-1 underline"
                          >
                            Login now
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
                    <p className="text-sm text-gray-600 mb-3">We Accept:</p>
                    <div className="flex items-center gap-3">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/196/196578.png"
                        alt="Visa"
                        className="h-8 w-auto opacity-70"
                      />
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/196/196561.png"
                        alt="MasterCard"
                        className="h-8 w-auto opacity-70"
                      />
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/196/196539.png"
                        alt="PayPal"
                        className="h-8 w-auto opacity-70"
                      />
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/5968/5968416.png"
                        alt="GPay"
                        className="h-8 w-auto opacity-70"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Cart State */
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
                <span className="material-symbols-outlined text-6xl text-gray-400">
                  shopping_cart
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Browse
                our products and find something you'll love!
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
