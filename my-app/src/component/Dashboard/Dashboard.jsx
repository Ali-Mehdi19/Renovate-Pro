'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '../layout/Footer';
import Navbar from '../layout/Navbar';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const router = useRouter();
  
  const handleLogout = () => {
    // Add your logout logic here (clear tokens, cookies, etc.)
    // For example: localStorage.removeItem('authToken');
    router.push('/');
  };

  const appointments = [
    { id: 1, date: '2023-08-15', time: '10:00 AM', address: '123 Main St, New York', status: 'Scheduled' },
    { id: 2, date: '2023-08-20', time: '2:30 PM', address: '456 Park Ave, Brooklyn', status: 'Pending' },
  ];

  const blueprints = [
    { id: 1, name: 'Residential Renovation', date: '2023-08-10', status: 'Completed' },
    { id: 2, name: 'Kitchen Remodel', date: '2023-08-18', status: 'In Progress' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar onLogout={handleLogout} notificationCount={2} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Sarah Johnson!</h1>
          <p className="text-gray-600">Manage your renovation projects from survey to completion</p>
        </div>

        {/* Dashboard Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['appointments', 'blueprints', 'projects'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link 
            href="/surveybooking" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Book New Survey
          </Link>
          <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Reports
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Surveys</h2>
              <span className="text-sm text-gray-500">2 appointments</span>
            </div>
            <ul className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{appointment.date} at {appointment.time}</h3>
                      <p className="text-gray-600">{appointment.address}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'Scheduled' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">Details</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-6 py-4 bg-gray-50 text-center">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View All Appointments
              </button>
            </div>
          </div>
        )}

        {/* Blueprints Tab */}
        {activeTab === 'blueprints' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Your Blueprints</h2>
              <span className="text-sm text-gray-500">2 blueprints</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {blueprints.map((blueprint) => (
                <div key={blueprint.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">Blueprint Preview</span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{blueprint.name}</h3>
                        <p className="text-sm text-gray-500">Created: {blueprint.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        blueprint.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {blueprint.status}
                      </span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Link 
                        href={`/blueprints/${blueprint.id}`}
                        className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
                      >
                        View
                      </Link>
                      <button className="flex-1 py-2 bg-white text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Your Projects</h2>
            </div>
            <div className="p-6 text-center">
              <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No active projects</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any renovation projects started yet. Book your first survey to get started!
                </p>
                <Link 
                  href="/surveybooking" 
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Book Your First Survey
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;