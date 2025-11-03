// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./main/Home";
import AboutCar from "./main/AboutCar";
import Learn from "./main/Learn";
import Dashboard from "./Content/Dashboard";
import Speedometer from "./Content/Speedometer";
import SharedCar from "./main/SharedCar"; // ✅ SharedCar now handles overlay internally
import Parts from "./Learn/Parts";
import Comparison from "./Comparison/Comparison";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main 3D landing route */}
        <Route
          path="/"
          element={
            <div className="overflow-x-hidden">
              {/* Full scrollable area: Home + AboutCar */}
              <div className="h-[200vh] relative">
                <Home />
                <AboutCar />
              </div>
              {/* SharedCar handles overlay internally */}
              <SharedCar />
            </div>
          }
        />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/speedometer" element={<Speedometer />} />
        <Route path="/parts" element={<Parts />} />
        <Route path="/comparison" element={<Comparison />} />
      </Routes>
    </Router>
  );
}
