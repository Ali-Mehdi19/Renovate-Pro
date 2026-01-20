'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Mail, Phone, User, Home, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

const HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM
const PROJECT_TYPES = [
  { value: 'kitchen', label: 'Kitchen Renovation', basePrice: 25000 },
  { value: 'bathroom', label: 'Bathroom Renovation', basePrice: 20000 },
  { value: 'whole_home', label: 'Whole Home Renovation', basePrice: 100000 },
  { value: 'commercial', label: 'Commercial Space', basePrice: 150000 },
  { value: 'other', label: 'Other', basePrice: 15000 }
];

const MOCK_BOOKINGS = {
  '2026-01-20': [10, 14, 15],
  '2026-01-21': [9, 11, 13],
  '2026-01-22': [12, 16]
};

const AppointmentBooking = () => {
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 18));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91 ',
    address: '',
    projectType: '',
    roomCount: 1,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const confirmationNumber = 'APT-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getWeekDays = (date) => {
    const days = [];
    const current = new Date(date);
    current.setDate(current.getDate() - current.getDay());
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const isTimeBooked = (date, hour) => {
    const dateStr = formatDate(date);
    return MOCK_BOOKINGS[dateStr]?.includes(hour) || false;
  };

  const getNextAvailable = () => {
    const days = viewMode === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate);
    
    for (const day of days) {
      if (!day || day < new Date()) continue;
      for (const hour of HOURS) {
        if (!isTimeBooked(day, hour)) {
          return { date: day, time: hour };
        }
      }
    }
    return null;
  };

  const calculatePrice = () => {
    const type = PROJECT_TYPES.find(t => t.value === formData.projectType);
    if (!type) return 0;
    return type.basePrice * formData.roomCount;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone.match(/^\+91 \d{10}$/)) {
      newErrors.phone = 'Valid phone number required (10 digits)';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.projectType) newErrors.projectType = 'Project type is required';
    if (!selectedDate) newErrors.date = 'Please select a date';
    if (selectedTime === null) newErrors.time = 'Please select a time';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !termsAccepted) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setShowConfirmModal(false);
    setShowSuccess(true);
  };

  const addToCalendar = (type) => {
    const startDate = new Date(selectedDate);
    startDate.setHours(selectedTime, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(selectedTime + 2, 0, 0);
    
    alert(`Calendar link for ${type} would be generated here`);
  };

  const renderDayView = () => {
    const date = selectedDate || currentDate;
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {HOURS.map(hour => {
            const booked = isTimeBooked(date, hour);
            const isPast = date.toDateString() === new Date().toDateString() && hour < new Date().getHours();
            const isSelected = selectedDate?.toDateString() === date.toDateString() && selectedTime === hour;
            
            return (
              <button
                key={hour}
                disabled={booked || isPast}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(hour);
                }}
                className={`p-4 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg'
                    : booked || isPast
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-50 hover:bg-green-100 text-green-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                  </span>
                  {booked ? (
                    <span className="text-xs">Booked</span>
                  ) : isPast ? (
                    <span className="text-xs">Past</span>
                  ) : (
                    <span className="text-xs font-medium">Available</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-semibold text-sm bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const isPast = day < new Date() && !isToday;
            const isSelected = selectedDate?.toDateString() === day.toDateString();
            
            return (
              <div key={idx} className={`border-r border-b min-h-32 p-2 ${isToday ? 'bg-blue-50' : ''}`}>
                <div className={`text-sm font-medium mb-2 ${isPast ? 'text-gray-400' : ''} ${isSelected ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {HOURS.slice(0, 4).map(hour => {
                    const booked = isTimeBooked(day, hour);
                    const hourPast = isPast || (isToday && hour < new Date().getHours());
                    
                    return (
                      <button
                        key={hour}
                        disabled={booked || hourPast}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedTime(hour);
                        }}
                        className={`w-full text-xs p-1 rounded transition-all ${
                          booked || hourPast
                            ? 'bg-gray-200 text-gray-500'
                            : 'bg-green-100 hover:bg-green-200 text-green-800'
                        }`}
                      >
                        {hour > 12 ? hour - 12 : hour}
                        {hour >= 12 ? 'PM' : 'AM'}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-semibold text-sm bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={idx} className="border-r border-b min-h-24 bg-gray-50"></div>;
            }
            
            const isToday = day.toDateString() === new Date().toDateString();
            const isPast = day < new Date() && !isToday;
            const isSelected = selectedDate?.toDateString() === day.toDateString();
            const availableSlots = HOURS.filter(h => !isTimeBooked(day, h) && !(isPast || (isToday && h < new Date().getHours()))).length;
            
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDate(day);
                  setViewMode('day');
                }}
                disabled={isPast}
                className={`border-r border-b min-h-24 p-2 text-left transition-all ${
                  isPast ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50'
                } ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${isPast ? 'text-gray-400' : ''} ${isSelected ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                {!isPast && (
                  <div className="text-xs text-gray-600">
                    {availableSlots} slots
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const nextAvailable = useMemo(() => getNextAvailable(), [currentDate, viewMode]);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-8">Your appointment has been successfully scheduled</p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <div className="text-sm text-gray-600 mb-2">Confirmation Number</div>
              <div className="text-2xl font-bold text-blue-600">{confirmationNumber}</div>
            </div>

            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <div className="font-medium">Date & Time</div>
                  <div className="text-gray-600">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at{' '}
                    {selectedTime === 12 ? '12:00 PM' : selectedTime > 12 ? `${selectedTime - 12}:00 PM` : `${selectedTime}:00 AM`}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-gray-600">{formData.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <div className="font-medium">Project Type</div>
                  <div className="text-gray-600">
                    {PROJECT_TYPES.find(t => t.value === formData.projectType)?.label}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Add to Calendar</div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => addToCalendar('Google')}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors font-medium"
                >
                  Google
                </button>
                <button
                  onClick={() => addToCalendar('Outlook')}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors font-medium"
                >
                  Outlook
                </button>
                <button
                  onClick={() => addToCalendar('iCal')}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors font-medium"
                >
                  iCal
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Confirmation email sent to {formData.email}
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 text-blue-600 hover:text-blue-700 font-medium"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule Your Site Survey</h1>
          <p className="text-gray-600">Book a free consultation with our renovation experts</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setViewMode('day')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Day
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
                    else if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
                    else newDate.setDate(newDate.getDate() - 1);
                    setCurrentDate(newDate);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-semibold">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
                    else if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
                    else newDate.setDate(newDate.getDate() + 1);
                    setCurrentDate(newDate);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {viewMode === 'month' && renderMonthView()}
              {viewMode === 'week' && renderWeekView()}
              {viewMode === 'day' && renderDayView()}

              {nextAvailable && (!selectedDate || !selectedTime) && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 Next available slot:{' '}
                    <button
                      onClick={() => {
                        setSelectedDate(nextAvailable.date);
                        setSelectedTime(nextAvailable.time);
                        setViewMode('day');
                      }}
                      className="font-medium underline hover:text-blue-900"
                    >
                      {nextAvailable.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                      {nextAvailable.time > 12 ? `${nextAvailable.time - 12}:00 PM` : `${nextAvailable.time}:00 AM`}
                    </button>
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith('+91 ')) {
                        value = '+91 ' + value.replace(/^\+91\s*/, '');
                      }
                      setFormData({ ...formData, phone: value });
                    }}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Project Address in Mumbai *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter your address in Mumbai"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Home className="w-4 h-4 inline mr-2" />
                    Project Type *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.projectType ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="">Select project type</option>
                    {PROJECT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.roomCount}
                    onChange={(e) => setFormData({ ...formData, roomCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any specific requirements or questions?"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              {selectedDate && selectedTime !== null ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Selected Date</div>
                        <div className="text-sm text-gray-600">
                          {selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Time Slot</div>
                        <div className="text-sm text-gray-600">
                          {selectedTime === 12 ? '12:00 PM' : selectedTime > 12 ? `${selectedTime - 12}:00 PM` : `${selectedTime}:00 AM`}
                          {' - '}
                          {selectedTime + 1 === 12 ? '12:00 PM' : selectedTime + 1 > 12 ? `${selectedTime + 1 - 12}:00 PM` : `${selectedTime + 1}:00 AM`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Survey Duration</div>
                        <div className="text-sm text-gray-600">1-2 hours</div>
                      </div>
                    </div>
                  </div>

                  {formData.projectType && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Home className="w-5 h-5 text-yellow-600 mt-1" />
                        <div className="w-full">
                          <div className="font-medium text-gray-900 mb-2">Estimated Price</div>
                          <div className="text-2xl font-bold text-yellow-600">
                            ₹{calculatePrice().toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Based on {formData.roomCount} room(s)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (validateForm()) {
                        setShowConfirmModal(true);
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors shadow-lg"
                  >
                    Proceed to Confirmation
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a date and time to continue</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Confirm Your Booking</h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Appointment Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Date</div>
                    <div className="font-medium">
                      {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Time</div>
                    <div className="font-medium">
                      {selectedTime === 12 ? '12:00 PM' : selectedTime > 12 ? `${selectedTime - 12}:00 PM` : `${selectedTime}:00 AM`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Personal Information</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium text-right max-w-xs">{formData.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Project Details</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Type:</span>
                    <span className="font-medium">
                      {PROJECT_TYPES.find(t => t.value === formData.projectType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Rooms:</span>
                    <span className="font-medium">{formData.roomCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Price:</span>
                    <span className="font-bold text-lg text-blue-600">
                      ₹{calculatePrice().toLocaleString('en-IN')}
                    </span>
                  </div>
                  {formData.notes && (
                    <div className="pt-2">
                      <span className="text-gray-600">Additional Notes:</span>
                      <p className="text-sm text-gray-800 mt-1 p-3 bg-gray-50 rounded">{formData.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the terms and conditions and understand that this booking is subject to availability. 
                    I consent to receive appointment confirmation and reminders via email and SMS.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!termsAccepted || isLoading}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    termsAccepted && !isLoading
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;