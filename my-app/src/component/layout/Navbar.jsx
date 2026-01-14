'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
// import { useAuth } from '../../contexts/AuthContext.js';

const Navbar = () => {
  const router = useRouter();
  const { user, logout, loading } = useAuth;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 w-10 h-10 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-800">RenovatePro</span>
          </div>
        </div>
      </header>
    );
  }

  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 w-10 h-10 rounded-lg" aria-hidden="true"></div>
          <Link 
            href={isAuthenticated ? "/dashboard" : "/"} 
            className="text-xl font-bold text-gray-800 hover:text-blue-600 transition"
          >
            RenovatePro
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          {isAuthenticated ? (
            // Authenticated User Navigation
            <>
              <Link href="/dashboard" className="text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/surveybooking" className="text-gray-600 hover:text-blue-600 font-medium">
                Book Survey
              </Link>
              <Link href="/blueprints" className="text-gray-600 hover:text-blue-600 font-medium">
                Blueprints
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-blue-600 font-medium">
                Support
              </Link>
              {user?.userType === 'auditor' && (
                <Link href="/surveys" className="text-gray-600 hover:text-blue-600 font-medium">
                  My Surveys
                </Link>
              )}
            </>
          ) : (
            // Public Navigation (Not Authenticated)
            <>
              <Link href="/#features" className="text-gray-600 hover:text-blue-600 font-medium">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium">
                How It Works
              </Link>
              <Link href="/#pricing" className="text-gray-600 hover:text-blue-600 font-medium">
                Pricing
              </Link>
              <Link href="/#contact" className="text-gray-600 hover:text-blue-600 font-medium">
                Contact
              </Link>
            </>
          )}
        </nav>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            // Authenticated User Menu
            <>
              <div className="relative">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" aria-hidden="true"></div>
                {/* Notification count would be dynamic */}
                {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span> */}
              </div>
              <button 
                className="text-gray-600 hover:text-blue-600 transition"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            // Public Login/Register Buttons
            <div className="flex space-x-4">
              <button 
                className="px-4 py-2 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
                onClick={() => router.push('/login')}
              >
                Login
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                onClick={() => router.push('/register')}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;