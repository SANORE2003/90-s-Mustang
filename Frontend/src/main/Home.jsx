import React, { useState } from "react";
import { Lock, Mail, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ import navigation

export default function Home() {
  const navigate = useNavigate(); // ✅ initialize navigator
  const [activeTab, setActiveTab] = useState("signin");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSigninChange = (e) => {
    const { name, value } = e.target;
    setSigninData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  // ✅ Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("🏁 Let's Drive! Registration successful.");
        setSignupData({ name: "", email: "", password: "" });

        // ✅ Redirect after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setErrorMessage("🔄 Try Again! " + (data.error || "Registration failed"));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("🔄 Try Again! Error connecting to server");
    }
  };

  // ✅ Signin handler
  const handleSignin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("🏁 Let's Drive! Login successful.");
        setSigninData({ email: "", password: "" });

        // ✅ Redirect after success
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setErrorMessage("🔄 Try Again! " + (data.error || "Invalid credentials"));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("🔄 Try Again! Error connecting to server");
    }
  };

  return (
    <div className="w-screen min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-purple-500/10 to-transparent" />
      </div>

      {/* Main layout */}
      <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center justify-between px-12 md:px-24 py-12 gap-12">
        {/* Auth Panel */}
        <div className="w-full max-w-md backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-blue-500/20 shadow-2xl p-8">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MUSTANG
            </h1>
            <p className="text-slate-400 text-sm">Experience the power</p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-center font-semibold animate-pulse">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => {
                setActiveTab("signin");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === "signin"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === "signup"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {activeTab === "signin" ? (
            // --- Sign In Form ---
            <form onSubmit={handleSignin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={signinData.email}
                    onChange={handleSigninChange}
                    placeholder="your@email.com"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    value={signinData.password}
                    onChange={handleSigninChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group hover:from-blue-500 hover:to-blue-600"
              >
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            // --- Sign Up Form ---
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="name"
                    type="text"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    placeholder="your@email.com"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group hover:from-blue-500 hover:to-blue-600"
              >
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>

        {/* Right side: Car and Text */}
        <div className="flex flex-col items-center justify-center text-center md:text-left md:items-start w-full md:w-1/2 space-y-6 relative">
          {/* Decorative background card */}
          <div className="absolute -inset-4 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-slate-900/20 rounded-3xl shadow-2xl blur-xl -z-10 animate-pulse-slow"></div>

          {/* Main content */}
          <div className="ml-40 md:ml-56 max-w-md text-slate-300 text-lg leading-relaxed space-y-4 p-6 bg-slate-900/50 rounded-2xl border border-blue-500/30 shadow-lg backdrop-blur-lg">
            <p className="text-white font-medium">
              Explore car features with the chatbot—engine performance, interior design, safety, and innovative technologies—while getting instant answers and learning how each component works.
            </p>

            <p className="font-semibold text-white text-xl border-l-4 border-blue-400 pl-2">
              Highlights you will love:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-200">
              <li>
                <span className="text-blue-400 font-medium">Interactive Learning:</span>{" "}
                Dive into aerodynamics, suspension systems, and engine performance with easy explanations.
              </li>
              <li>
                <span className="text-purple-400 font-medium">Detailed Insights:</span>{" "}
                Explore safety features, infotainment systems, and design elements of each Mustang model.
              </li>
              <li>
                <span className="text-teal-400 font-medium">Virtual Demonstrations:</span>{" "}
                See engine functions, brake systems, and driving dynamics in action through the chatbot.
              </li>
            </ul>

            <p className="text-slate-100 italic border-t border-slate-700 pt-3 mt-4">
              Whether you're a car enthusiast or just curious, the chatbot guides you through the Mustang's history, rare editions, specs, and maintenance tips.
            </p>
          </div>

          {/* Optional decorative floating dots */}
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-bounce-slow"></div>
        </div>
      </div>
    </div>
  );
}