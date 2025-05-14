import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectPath, setRedirectPath] = useState("/");
  const navigate = useNavigate();

  // Check for redirect path on component mount
  useEffect(() => {
    const savedRedirectPath = localStorage.getItem("redirectAfterLogin");
    if (savedRedirectPath) {
      setRedirectPath(savedRedirectPath);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://shop-smart-e-commerce.onrender.com/auth/login",
        {
          email,
          password,
        }
      );

      // Extract token and user data from response
      const { accessToken, user } = response.data;

      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem("token", accessToken);
      } else {
        sessionStorage.setItem("token", accessToken);
      }

      // Store user data in localStorage for use across the app
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      // Set token for future axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      setIsLoading(false);

      // Navigate to the redirect path (if it exists) and then clear it
      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
      const shouldProceedToCheckout = redirectTo === "/cart";
      localStorage.removeItem("redirectAfterLogin");

      // If user was redirected from cart, set a flag to trigger immediate checkout
      if (shouldProceedToCheckout) {
        localStorage.setItem("proceedToPayment", "true");
      }

      navigate(redirectTo);
    } catch (error) {
      setIsLoading(false);
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center mb-12">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-2 text-xl font-bold">RetailCanvas</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600 mt-2">
              {redirectPath === "/cart"
                ? "Sign in to complete your checkout"
                : "Sign in to your account"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{error}</p>
            </div>
          )}

          {redirectPath === "/cart" && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
              <p>Please sign in to proceed with your checkout</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex items-center mt-4">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-3 rounded-md font-medium mt-4 flex items-center justify-center
                ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
            >
              {isLoading ? (
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
                  Signing in...
                </>
              ) : redirectPath === "/cart" ? (
                "Sign in to checkout"
              ) : (
                "Sign in"
              )}
            </button>

            <p className="text-center mt-4 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Image with overlay text */}
      <div
        className="hidden lg:block lg:w-1/2 relative bg-gray-400 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-4xl font-bold mb-4">
            {redirectPath === "/cart"
              ? "Complete Your Purchase"
              : "Discover Amazing Products"}
          </h2>
          <p className="text-xl text-center mb-12 max-w-md">
            {redirectPath === "/cart"
              ? "Sign in to complete your checkout process and finalize your order."
              : "Sign in to access your personalized shopping experience, track orders, and get exclusive deals."}
          </p>

          <div className="flex space-x-12 mt-8">
            <div className="text-center">
              <div className="font-medium">Fast Delivery</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Secure Checkout</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Quality Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
