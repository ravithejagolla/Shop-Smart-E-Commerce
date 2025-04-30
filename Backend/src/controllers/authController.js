import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://shop-smart-e-commerce.onrender.com/auth/login",
        { email, password },
        { withCredentials: true } // allow cookies (refreshToken)
      );

      const token = response.data.accessToken;

      // Store token in localStorage or sessionStorage
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      // Set default auth header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alert("Login successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Login failed";
      alert(message);
    }
  };

  return (
    <div className="flex min-h-screen">
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
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

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
                className="w-full p-3 border rounded-md"
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
                className="w-full p-3 border rounded-md"
                required
              />
            </div>

            <div className="flex items-center mt-4">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
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
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium mt-4"
            >
              Sign in
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

      {/* Right-side image */}
      <div
        className="hidden lg:block lg:w-1/2 relative bg-gray-400 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-4xl font-bold mb-4">Discover Amazing Products</h2>
          <p className="text-xl text-center mb-12 max-w-md">
            Sign in to access your personalized shopping experience, track
            orders, and get exclusive deals.
          </p>
          <div className="flex space-x-12 mt-8">
            <div className="text-center font-medium">Fast Delivery</div>
            <div className="text-center font-medium">Secure Checkout</div>
            <div className="text-center font-medium">Quality Products</div>
          </div>
        </div>
      </div>
    </div>
  );
}
