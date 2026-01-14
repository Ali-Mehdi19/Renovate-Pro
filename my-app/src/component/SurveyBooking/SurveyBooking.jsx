'use client';
import React, { useState } from 'react';
import { CheckCircle, Calendar, MapPin, Clock, Phone, FileText, User, Home } from 'lucide-react';

const BookSurvey = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: '',
    address: '',
    projectType: '',
    preferredDate: '',
    preferredTime: '',
    contactInfo: '',
    specialInstructions: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.address) newErrors.address = 'Property address is required';
    if (!formData.projectType) newErrors.projectType = 'Project type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
    if (!formData.preferredTime) newErrors.preferredTime = 'Preferred time is required';
    if (!formData.contactInfo) newErrors.contactInfo = 'Contact information is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = (e) => {
    if (e) e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleStep2Submit = (e) => {
    if (e) e.preventDefault();
    if (validateStep2()) {
      console.log('Survey booked:', formData);
      setStep(3);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeSlot) => {
    const timeMap = {
      'morning': 'Morning (9:00 AM - 12:00 PM)',
      'afternoon': 'Afternoon (1:00 PM - 4:00 PM)',
      'evening': 'Evening (5:00 PM - 7:00 PM)'
    };
    return timeMap[timeSlot] || timeSlot;
  };

  const generateReferenceId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `RP-${new Date().getFullYear()}-${timestamp}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              RenovatePro
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Dashboard</a>
            <a href="#" className="text-blue-600 font-medium relative">
              Book Survey
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Blueprints</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Support</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed border-gray-400 rounded-xl w-8 h-8 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            <button className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Logout</button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Book Your Property Survey
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule an on-site assessment with our certified auditors and get expert insights for your renovation project
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className={`font-medium transition-colors ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                Property Details
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= 2 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className={`font-medium transition-colors ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                Schedule
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= 3 ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
              }`}>
                {step >= 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
              </div>
              <span className={`font-medium transition-colors ${step >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
                Confirmation
              </span>
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full shadow-sm" 
              style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
            ></div>
          </div>
        </div>

        {/* Step 1: Property Details */}
        {step === 1 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Property Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl transition-all focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.propertyType ? 'border-red-300 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">Select property type</option>
                  <option value="residential">🏠 Residential</option>
                  <option value="commercial">🏢 Commercial</option>
                  <option value="industrial">🏭 Industrial</option>
                </select>
                {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full property address"
                    className={`w-full pl-12 pr-4 py-4 bg-white/80 border-2 rounded-xl transition-all focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                      errors.address ? 'border-red-300 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Type</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl transition-all focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.projectType ? 'border-red-300 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">Select project type</option>
                  <option value="renovation">🏗️ Renovation</option>
                  <option value="extension">🏡 Extension</option>
                  <option value="new-build">🏠 New Build</option>
                  <option value="kitchen">🍳 Kitchen Remodel</option>
                  <option value="bathroom">🚽 Bathroom Remodel</option>
                </select>
                {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
              </div>
              
              <div className="pt-6">
                <button
                  onClick={handleStep1Submit}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Continue to Schedule →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Schedule Appointment */}
        {step === 2 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Schedule Your Appointment</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-12 pr-4 py-4 bg-white/80 border-2 rounded-xl transition-all focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                        errors.preferredDate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 bg-white/80 border-2 rounded-xl transition-all focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                        errors.preferredTime ? 'border-red-300 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <option value="">Select time slot</option>
                      <option value="morning">🌅 Morning (9:00 AM - 12:00 PM)</option>
                      <option value="afternoon">☀️ Afternoon (1:00 PM - 4:00 PM)</option>
                      <option value="evening">🌆 Evening (5:00 PM - 7:00 PM)</option>
                    </select>
                  </div>
                  {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Information</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="Phone number or email address"
                    className={`w-full pl-12 pr-4 py-4 bg-white/80 border-2 rounded-xl transition-all focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                      errors.contactInfo ? 'border-red-300 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
                {errors.contactInfo && <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    placeholder="Any special requirements, access instructions, or additional notes..."
                    rows="4"
                    className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-gray-300 resize-none"
                  ></textarea>
                </div>
              </div>
              
              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-white text-blue-600 border-2 border-blue-200 font-semibold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-[1.02] shadow-md"
                >
                  ← Back to Property Details
                </button>
                <button
                  onClick={handleStep2Submit}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Book Survey →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Survey Booked Successfully! 🎉</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Your property survey has been scheduled for <span className="font-semibold text-blue-600">{formatDate(formData.preferredDate)}</span> during the <span className="font-semibold text-blue-600">{formatTime(formData.preferredTime)}</span> time slot.
            </p>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 text-left max-w-2xl mx-auto border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-4 text-center">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Property Address:</span>
                  </span>
                  <span className="font-semibold text-gray-800">{formData.address}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Home className="w-4 h-4" />
                    <span>Project Type:</span>
                  </span>
                  <span className="font-semibold text-gray-800 capitalize">{formData.projectType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Contact Info:</span>
                  </span>
                  <span className="font-semibold text-gray-800">{formData.contactInfo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Reference ID:</span>
                  </span>
                  <span className="font-mono font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">{generateReferenceId()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => alert('Appointment details would be shown here')}
                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-200 font-semibold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-[1.02] shadow-md"
              >
                View Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSurvey;