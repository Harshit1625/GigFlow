import React, { useState } from "react";
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();

  const validateEmail = (value) => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    } else if (!value.endsWith("@gmail.com")) {
      setEmailError("Email must end with '@gmail.com'");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    } else if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all the required fields!");
      return;
    }

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setError("Please fill all the required fields correctly!");
      return;
    }

    api
      .post("/api/auth/login", { email, password })
      .then(() => {
        setEmail("");
        setPassword("");
        nav("/");
      })
      .catch(() => {
        setError("Some Error Occurred");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">GigFlow</h1>
      </div>

      {/* Login Card */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-14">
          {/* Heading */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Login</h1>
            <LogIn className="text-indigo-600 mt-1" />
          </div>

          {/* Global Error */}
          {error && (
            <div className="flex items-center gap-2 border border-dotted border-red-400 text-red-600 bg-red-50 px-4 py-2 rounded-md mb-5 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="mb-2">
            <label className="text-sm text-gray-600">Email</label>

            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg mt-1">
              <Mail size={18} className="text-gray-500" />
              <input
                type="email"
                value={email}
                placeholder="you@gmail.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>

            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Password</label>

            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg mt-1">
              <Lock size={18} className="text-gray-500" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onBlur={(e) => validatePassword(e.target.value)}
                className="bg-transparent w-full outline-none text-sm"
              />

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <p className="text-center mt-1 font-semibold text-gray-400">
            New Here ?{" "}
            <span className="text-indigo-500">
              {" "}
              <Link to="/signup">Create Account</Link>
            </span>
          </p>

          {/* Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition mt-5"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
