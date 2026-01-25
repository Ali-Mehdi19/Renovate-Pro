'use client';
import React, { useState, useRef } from 'react';
import { Camera, MapPin, User, Home, ArrowLeft, Check, Upload, X, Calendar, Phone, Mail, Save, Send, FileText } from 'lucide-react';

// Demo appointment data - in real app, this would come from route params
const appointmentData = {
  1: {
    id: 1,
    customer: 'Rajesh Kumar',
    address: '123 Marine Drive, Mumbai',
    time: '09:00 AM',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    propertyType: 'Apartment',
    scheduledDate: '2026-01-25'
  },
  2: {
    id: 2,
    customer: 'Priya Sharma',
    address: '456 Colaba Causeway, Mumbai',
    time: '11:30 AM',
    phone: '+91 98765 43211',
    email: 'priya.sharma@email.com',
    propertyType: 'Villa',
    scheduledDate: '2026-01-25'
  },
  3: {
    id: 3,
    customer: 'Amit Patel',
    address: '789 Bandra West, Mumbai',
    time: '02:00 PM',
    phone: '+91 98765 43212',
    email: 'amit.patel@email.com',
    propertyType: 'Office',
    scheduledDate: '2026-01-25'
  }
};

export default function SurveyPage() {
  // Simulate getting appointment ID from URL - using ID 1 as default
  const appointmentId = 1;
  const appointment = appointmentData[appointmentId] || appointmentData[1];

  const [formData, setFormData] = useState({
    propertyType: appointment.propertyType,
    bedrooms: '',
    bathrooms: '',
    totalArea: '',
    builtYear: '',
    condition: '',
    floorNumber: '',
    totalFloors: '',
    facing: '',
    parking: '',
    furnishing: '',
    waterSupply: '',
    powerBackup: '',
    additionalNotes: '',
    photos: []
  });

  const [currentSection, setCurrentSection] = useState('basic');
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    }));
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId)
    }));
  };

  const handleSaveDraft = () => {
    alert('Survey saved as draft!');
    console.log('Draft saved:', formData);
  };

  const handleSubmit = () => {
    alert('Survey submitted successfully!');
    console.log('Survey submitted:', formData);
    // In real app: navigate back or to next survey
  };

  const goBack = () => {
    if (window.confirm('Are you sure? Unsaved changes will be lost.')) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold">Property Survey</h1>
            </div>
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              <span className="font-medium">Save Draft</span>
            </button>
          </div>

          {/* Customer Info Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1">{appointment.customer}</h2>
                    <div className="flex items-start gap-2 text-white/90 text-sm">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{appointment.address}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                    <Phone className="w-3 h-3" />
                    <span>Phone</span>
                  </div>
                  <p className="text-sm font-medium">{appointment.phone}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>Time</span>
                  </div>
                  <p className="text-sm font-medium">{appointment.time}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Survey Sections</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setCurrentSection('basic')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    currentSection === 'basic'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Basic Information</span>
                </button>
                <button
                  onClick={() => setCurrentSection('details')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    currentSection === 'details'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Property Details</span>
                </button>
                <button
                  onClick={() => setCurrentSection('photos')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    currentSection === 'photos'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span>Photos & Media</span>
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  Submit Survey
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            {currentSection === 'basic' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type *
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => handleInputChange('propertyType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="House">House</option>
                      <option value="Office">Office</option>
                      <option value="Shop">Shop</option>
                      <option value="Land">Land</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Bedrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      placeholder="e.g., 2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Bathrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      placeholder="e.g., 2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Area (sq ft) *
                    </label>
                    <input
                      type="number"
                      value={formData.totalArea}
                      onChange={(e) => handleInputChange('totalArea', e.target.value)}
                      placeholder="e.g., 1200"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Built
                    </label>
                    <input
                      type="number"
                      value={formData.builtYear}
                      onChange={(e) => handleInputChange('builtYear', e.target.value)}
                      placeholder="e.g., 2015"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentSection === 'details' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Condition *
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Condition</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Needs Repair">Needs Repair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor Number
                    </label>
                    <input
                      type="number"
                      value={formData.floorNumber}
                      onChange={(e) => handleInputChange('floorNumber', e.target.value)}
                      placeholder="e.g., 5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Floors in Building
                    </label>
                    <input
                      type="number"
                      value={formData.totalFloors}
                      onChange={(e) => handleInputChange('totalFloors', e.target.value)}
                      placeholder="e.g., 12"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facing Direction
                    </label>
                    <select
                      value={formData.facing}
                      onChange={(e) => handleInputChange('facing', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Direction</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="North-East">North-East</option>
                      <option value="North-West">North-West</option>
                      <option value="South-East">South-East</option>
                      <option value="South-West">South-West</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parking Availability
                    </label>
                    <select
                      value={formData.parking}
                      onChange={(e) => handleInputChange('parking', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Option</option>
                      <option value="No Parking">No Parking</option>
                      <option value="1 Car">1 Car</option>
                      <option value="2 Cars">2 Cars</option>
                      <option value="3+ Cars">3+ Cars</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Furnishing Status
                    </label>
                    <select
                      value={formData.furnishing}
                      onChange={(e) => handleInputChange('furnishing', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="Unfurnished">Unfurnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Fully Furnished">Fully Furnished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Water Supply
                    </label>
                    <select
                      value={formData.waterSupply}
                      onChange={(e) => handleInputChange('waterSupply', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="Municipal">Municipal</option>
                      <option value="Borewell">Borewell</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Power Backup
                    </label>
                    <select
                      value={formData.powerBackup}
                      onChange={(e) => handleInputChange('powerBackup', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="None">None</option>
                      <option value="Partial">Partial</option>
                      <option value="Full">Full</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes & Observations
                    </label>
                    <textarea
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      placeholder="Enter any additional observations, special features, or notes about the property..."
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentSection === 'photos' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Photos</h2>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-xl p-12 flex flex-col items-center justify-center gap-3 hover:from-blue-100 hover:to-blue-200 transition-all"
                  >
                    <div className="bg-blue-500 rounded-full p-6">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-blue-700 font-semibold text-lg">Upload Property Photos</p>
                      <p className="text-sm text-gray-600 mt-2">Click to browse or drag and drop images here</p>
                      <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG (Max 10MB per file)</p>
                    </div>
                  </button>

                  {formData.photos.length > 0 && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-gray-700">
                          {formData.photos.length} Photo{formData.photos.length !== 1 ? 's' : ''} Uploaded
                        </p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          + Add More
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.photos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-48 object-cover rounded-lg shadow-sm"
                            />
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 rounded-b-lg">
                              <p className="text-white text-xs font-medium truncate">{photo.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 rounded-full p-2 mt-1">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-3">Photo Guidelines</h3>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Capture clear front exterior view of the property</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Take photos of all rooms including living room, bedrooms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Include bathroom and kitchen areas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Document any damages, repairs needed, or special features</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Capture parking area and common facilities if available</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}