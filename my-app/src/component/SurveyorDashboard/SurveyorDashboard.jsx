'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Navigation, MapPin, Radio, Wifi, WifiOff, Clock, User, Navigation2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from "next/navigation";

// Sample appointments data
const sampleAppointments = [
  {
    id: 1,
    customer: 'Rajesh Kumar',
    address: '123 Marine Drive, Mumbai',
    time: '09:00 AM',
    lat: 18.9432,
    lng: 72.8236,
    status: 'today',
    distance: '2.3 km'
  },
  {
    id: 2,
    customer: 'Priya Sharma',
    address: '456 Colaba Causeway, Mumbai',
    time: '11:30 AM',
    lat: 18.9067,
    lng: 72.8147,
    status: 'today',
    distance: '4.7 km'
  },
  {
    id: 3,
    customer: 'Amit Patel',
    address: '789 Bandra West, Mumbai',
    time: '02:00 PM',
    lat: 19.0596,
    lng: 72.8295,
    status: 'upcoming',
    distance: '8.2 km'
  },
  {
    id: 4,
    customer: 'Sneha Desai',
    address: '321 Andheri East, Mumbai',
    time: 'Yesterday',
    lat: 19.1136,
    lng: 72.8697,
    status: 'overdue',
    distance: '12.5 km'
  },
  {
    id: 5,
    customer: 'Vikram Singh',
    address: '654 Powai, Mumbai',
    time: '04:30 PM',
    lat: 19.1197,
    lng: 72.9078,
    status: 'upcoming',
    distance: '15.1 km'
  }
];

// Leaflet Map Component
function LeafletMap({ appointments, userLocation }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js';
    script.onload = initMap;
    document.body.appendChild(script);

    function initMap() {
      if (mapInstanceRef.current || !mapRef.current) return;

      const L = window.L;
      
      const map = L.map(mapRef.current, {
        zoomControl: false
      }).setView([userLocation.lat, userLocation.lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      const userIcon = L.divIcon({
        html: `<div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); width: 24px; height: 24px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); position: relative;">
          <div style="position: absolute; inset: 0; border-radius: 50%; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          }
        </style>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<div style="padding: 8px;"><b style="color: #3b82f6;">Your Location</b></div>');

      updateMarkers();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    updateMarkers();
  }, [appointments]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  function updateMarkers() {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const statusColors = {
      today: '#22c55e',
      upcoming: '#3b82f6',
      overdue: '#ef4444'
    };

    appointments.forEach((apt) => {
      const color = statusColors[apt.status];
      const icon = L.divIcon({
        html: `
          <svg width="36" height="46" viewBox="0 0 36 46" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="shadow-${apt.id}" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="0" dy="2" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.059 27.941 0 18 0z" fill="${color}" filter="url(#shadow-${apt.id})"/>
            <circle cx="18" cy="18" r="7" fill="white"/>
          </svg>
        `,
        className: '',
        iconSize: [36, 46],
        iconAnchor: [18, 46],
        popupAnchor: [0, -46]
      });

      const marker = L.marker([apt.lat, apt.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 12px; min-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="font-weight: 700; margin: 0 0 8px 0; font-size: 15px; color: #111827;">${apt.customer}</h3>
            <p style="margin: 6px 0; font-size: 13px; color: #6b7280; line-height: 1.4;">${apt.address}</p>
            <div style="display: flex; align-items: center; gap: 8px; margin: 8px 0;">
              <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #374151;">${apt.time}</span>
              <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 6px; font-size: 12px; color: #6b7280;">${apt.distance}</span>
            </div>
            <button 
              onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${apt.lat},${apt.lng}', '_blank')"
              style="margin-top: 12px; width: 100%; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); transition: all 0.2s;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.4)';"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(59, 130, 246, 0.3)';"
            >
              Get Directions →
            </button>
          </div>
        `);

      markersRef.current.push(marker);
    });
  }

  return <div ref={mapRef} className="w-full h-full" />;
}

// Main Dashboard Component
export default function SurveyorDashboard() {
  const [appointments] = useState(sampleAppointments);
  const [userLocation, setUserLocation] = useState({ lat: 19.0760, lng: 72.8777 });
  const [isOffline, setIsOffline] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState(340);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [locationLoading, setLocationLoading] = useState(false);
  const controls = useAnimation();
  const constraintsRef = useRef(null);

  const statusConfig = {
    today: { 
      color: 'bg-emerald-500', 
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      label: 'Today'
    },
    upcoming: { 
      color: 'bg-blue-500', 
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      label: 'Upcoming'
    },
    overdue: { 
      color: 'bg-red-500', 
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      label: 'Overdue'
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get location. Please enable location services.');
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOffline) {
        setSyncStatus('syncing');
        setTimeout(() => setSyncStatus('synced'), 1000);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isOffline]);

  const handleDragEnd = (event, info) => {
    const threshold = -100;
    if (info.offset.y < threshold) {
      setDrawerHeight(window.innerHeight - 100);
      controls.start({ y: -(window.innerHeight - 440) });
    } else {
      setDrawerHeight(340);
      controls.start({ y: 0 });
    }
  };

  const openDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

const router = useRouter();

  const startSurvey = (id) => {
    alert(`Starting survey for appointment #${id}`);
    router.push(`/surveyor/survey/${id}`);
  };

  const optimizeRoute = () => {
    alert('Route optimization: Sorting appointments by proximity...');
  };

  const todayAppointments = appointments.filter(a => a.status === 'today');

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Map Container */}
      <div className="absolute inset-0">
        <LeafletMap 
          appointments={appointments} 
          userLocation={userLocation}
        />
      </div>

      {/* Top Action Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4">
        <div className="flex justify-between items-start">
          {/* Status Badge */}
          <motion.div 
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg px-4 py-3 border border-gray-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              {isOffline ? (
                <>
                  <WifiOff className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-semibold text-red-700">Offline Mode</span>
                </>
              ) : (
                <>
                  {syncStatus === 'syncing' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Wifi className="w-5 h-5 text-blue-500" />
                    </motion.div>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                  <span className="text-sm font-semibold text-gray-700">
                    {syncStatus === 'syncing' ? 'Syncing...' : 'All Synced'}
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <motion.button
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-3.5 active:scale-95 transition-all border border-gray-100 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Get current location"
            >
              <Navigation className={`w-6 h-6 text-blue-600 ${locationLoading ? 'animate-pulse' : ''}`} />
            </motion.button>
            <motion.button
              onClick={optimizeRoute}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-3.5 active:scale-95 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Optimize route"
            >
              <Navigation2 className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Drawer */}
      <div ref={constraintsRef} className="absolute bottom-0 left-0 right-0 z-[1000]" style={{ height: '100vh' }}>
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-2xl"
          drag="y"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ y: 0 }}
          style={{ height: `${drawerHeight}px` }}
        >
          {/* Drawer Handle */}
          <div className="w-full flex justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing">
            <div className="w-14 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Today's Schedule</h2>
                <p className="text-sm text-gray-500">{todayAppointments.length} appointments today</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded-2xl text-lg font-bold shadow-md">
                {todayAppointments.length}
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="overflow-y-auto" style={{ height: `${drawerHeight - 140}px` }}>
            <div className="px-4 py-3 space-y-3">
              {appointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 shadow-sm ${statusConfig[apt.status].color}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            {apt.customer}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 flex items-start gap-2 mb-3">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                          <span className="break-words">{apt.address}</span>
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700">
                            <Clock className="w-3.5 h-3.5" />
                            {apt.time}
                          </span>
                          <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600">
                            <Radio className="w-3.5 h-3.5" />
                            {apt.distance}
                          </span>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig[apt.status].bgColor} ${statusConfig[apt.status].textColor}`}>
                            {statusConfig[apt.status].label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => openDirections(apt.lat, apt.lng)}
                      className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all border border-blue-200 hover:from-blue-100 hover:to-blue-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      📍 Directions
                    </motion.button>
                    <motion.button
                      onClick={() => startSurvey(apt.id)}
                      className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white py-3.5 px-4 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ✓ Start Survey
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Legend */}
      <motion.div 
        className="absolute bottom-[360px] left-4 z-[999] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 text-sm border border-gray-100"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wide">Status</h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm" />
            <span className="font-medium text-gray-700">Today</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm" />
            <span className="font-medium text-gray-700">Upcoming</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm" />
            <span className="font-medium text-gray-700">Overdue</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}