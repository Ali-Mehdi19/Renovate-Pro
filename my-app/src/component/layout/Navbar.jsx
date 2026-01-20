"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Ruler, Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Ruler className="w-8 h-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              RenovatePro
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600">
              How It Works
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </a>
            <button onClick={() => router.push("/login")}>
              Login
            </button>
            <button
              onClick={() => router.push("/bookingsurvey")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Book a Survey
            </button>
          </div>

          {/* Mobile */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#contact">Contact</a>
            <button onClick={() => router.push("/login")}>
              Login
            </button>
            <button
              onClick={() => router.push("/bookingsurvey")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Book a Survey
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
