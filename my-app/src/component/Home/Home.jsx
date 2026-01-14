'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';


const HomePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Use the unified Navbar */}
      <Navbar isAuthenticated={false} />
      
      {/* Hero Section */}
      <section className="py-16 md:py-28">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Streamline Your Renovation Projects From Survey to Blueprint
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Connect with professional auditors, digitize your property surveys, 
              and generate accurate blueprints automatically - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-lg"
                onClick={() => router.push('/surveybooking')}
              >
                Book a Survey
              </button>
              <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition">
                Watch Demo
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
                <span className="text-gray-500">App Preview Visualization</span>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg">
                AI-Powered Blueprints
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Transform Your Workflow</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our integrated solution connects all stakeholders and automates critical 
              steps in the renovation planning process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "1-Click Survey Booking", 
                desc: "Customers schedule on-site audits with certified professionals in seconds" 
              },
              { 
                title: "Digital Audit Tools", 
                desc: "Auditors capture precise measurements and property data through our mobile app" 
              },
              { 
                title: "Instant Blueprints", 
                desc: "AI transforms survey data into accurate preliminary designs automatically" 
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps from survey request to blueprint delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Book Survey", desc: "Schedule your property assessment" },
              { step: "2", title: "On-site Audit", desc: "Professional auditor visits your property" },
              { step: "3", title: "Data Processing", desc: "AI analyzes measurements and data" },
              { step: "4", title: "Get Blueprint", desc: "Receive your automated design" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Renovation Process?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Join hundreds of professionals already using our platform to save time and reduce errors
          </p>
          <button 
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
            onClick={() => router.push('/register')}
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Use the unified Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;