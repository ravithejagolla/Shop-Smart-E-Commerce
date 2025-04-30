import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        "https://shop-smart-e-commerce.onrender.com/auth/register",
        {
          username: `${firstName} ${lastName}`,
          email,
          password,
        }
      );

      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Registration failed";
      alert(message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side - Image with overlay text */}
      <div
        className="hidden lg:block lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-bold mb-6">Join Our Community</h1>
          <p className="text-xl mb-12">
            Create an account to start shopping, save favorites, track orders,
            and enjoy a personalized experience.
          </p>

          <div className="flex space-x-8 mt-8">
            <div className="text-center">
              <div className="font-medium mb-2">Free Returns</div>
            </div>
            <div className="text-center">
              <div className="font-medium mb-2">Member Discounts</div>
            </div>
            <div className="text-center">
              <div className="font-medium mb-2">Exclusive Deals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-6">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-2 text-xl font-bold">RetailCanvas</span>
            </div>
            <h2 className="text-3xl font-bold">Create an account</h2>
            <p className="text-gray-600 mt-2">
              Get started with your shopping journey
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                className="w-full p-3 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                className="w-full p-3 border rounded-md"
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm">
                I accept the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  terms and conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  privacy policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium mt-4"
              disabled={!acceptTerms}
            >
              Create account
            </button>

            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
