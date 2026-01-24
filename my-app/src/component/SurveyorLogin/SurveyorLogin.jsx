'use client';
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Loader2, MapPin, AlertCircle, CheckCircle2, Fingerprint } from 'lucide-react';

export default function SurveyorAuth() {
  const [surveyorId, setSurveyorId] = useState('');
  const [pin, setPin] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for biometric support
  useEffect(() => {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => setBiometricAvailable(available))
        .catch(() => setBiometricAvailable(false));
    }
  }, []);

  // Load saved credentials
  useEffect(() => {
    const saved = localStorage.getItem('surveyorCreds');
    if (saved) {
      try {
        const { id, remember } = JSON.parse(saved);
        if (remember) {
          setSurveyorId(id);
          setRememberMe(true);
        }
      } catch (e) {
        console.error('Failed to load credentials');
      }
    }

    // Check existing session
    const session = sessionStorage.getItem('surveyorSession');
    if (session) {
      try {
        const { expiry, surveyorId: savedId } = JSON.parse(session);
        if (Date.now() < expiry) {
          setIsLoggedIn(true);
          setSurveyorId(savedId);
          setSessionTimeout(expiry);
        } else {
          sessionStorage.removeItem('surveyorSession');
        }
      } catch (e) {
        console.error('Session error');
      }
    }

    // Load last sync time
    const sync = localStorage.getItem('lastSync');
    if (sync) setLastSync(new Date(parseInt(sync)));
  }, []);

  // Session timeout monitor
  useEffect(() => {
    if (!sessionTimeout) return;

    const interval = setInterval(() => {
      if (Date.now() >= sessionTimeout) {
        handleLogout();
        setError('Session expired. Please login again.');
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [sessionTimeout]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation
    if (surveyorId.length < 4) {
      setError('Invalid Surveyor ID');
      setIsLoading(false);
      return;
    }

    if (pin.length < 4) {
      setError('PIN must be at least 4 characters');
      setIsLoading(false);
      return;
    }

    // Mock authentication
    if (surveyorId === 'SV001' && pin === '1234') {
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('surveyorCreds', JSON.stringify({
          id: surveyorId,
          remember: true
        }));
      }

      // Create session (30 minutes)
      const expiry = Date.now() + (30 * 60 * 1000);
      sessionStorage.setItem('surveyorSession', JSON.stringify({
        surveyorId,
        expiry
      }));
      setSessionTimeout(expiry);

      // Update sync time
      const now = Date.now();
      localStorage.setItem('lastSync', now.toString());
      setLastSync(new Date(now));

      setIsLoggedIn(true);
      setIsLoading(false);
    } else if (surveyorId === 'LOCKED') {
      setError('Account locked. Contact administrator.');
      setIsLoading(false);
    } else if (!isOnline) {
      // Offline mode - check cached credentials
      const cached = localStorage.getItem('surveyorCreds');
      if (cached) {
        try {
          const { id } = JSON.parse(cached);
          if (id === surveyorId) {
            setError('');
            setIsLoggedIn(true);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Cache error');
        }
      }
      setError('Cannot verify credentials offline. Network required for first login.');
      setIsLoading(false);
    } else {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setError('');
    setIsLoading(true);

    // Simulate biometric authentication
    await new Promise(resolve => setTimeout(resolve, 1000));

    const cached = localStorage.getItem('surveyorCreds');
    if (cached) {
      try {
        const { id } = JSON.parse(cached);
        setSurveyorId(id);
        
        const expiry = Date.now() + (30 * 60 * 1000);
        sessionStorage.setItem('surveyorSession', JSON.stringify({
          surveyorId: id,
          expiry
        }));
        setSessionTimeout(expiry);

        const now = Date.now();
        localStorage.setItem('lastSync', now.toString());
        setLastSync(new Date(now));

        setIsLoggedIn(true);
      } catch (e) {
        setError('Biometric authentication failed');
      }
    } else {
      setError('No saved credentials. Please login with ID and PIN first.');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('surveyorSession');
    setIsLoggedIn(false);
    setPin('');
    setSessionTimeout(null);
  };

  const syncData = async () => {
    if (!isOnline) {
      setError('Cannot sync while offline');
      return;
    }

    setIsLoading(true);
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const now = Date.now();
    localStorage.setItem('lastSync', now.toString());
    setLastSync(new Date(now));
    setIsLoading(false);
  };

  const formatLastSync = () => {
    if (!lastSync) return 'Never';
    const diff = Date.now() - lastSync.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return lastSync.toLocaleDateString();
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Survey Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-md mx-auto w-full px-4 py-6">
          <div className="bg-white rounded-xl shadow-md p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome, {surveyorId}</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Connection Status</p>
                  <p className="font-semibold text-gray-900">
                    {isOnline ? 'Online' : 'Offline Mode'}
                  </p>
                </div>
                {isOnline ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Last Synced</p>
                  <p className="font-semibold text-gray-900">{formatLastSync()}</p>
                </div>
                <button
                  onClick={syncData}
                  disabled={!isOnline || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    'Sync Now'
                  )}
                </button>
              </div>

              {!isOnline && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    You're working offline. Data will sync automatically when connection is restored.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900">New Survey</p>
            </button>
            <button className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900">View Reports</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* Status Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Surveyor Portal</span>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-600">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Surveyor Login</h1>
              <p className="text-sm text-gray-600">Enter your credentials to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="surveyorId" className="block text-sm font-medium text-gray-700 mb-2">
                  Surveyor ID
                </label>
                <input
                  type="text"
                  id="surveyorId"
                  value={surveyorId}
                  onChange={(e) => setSurveyorId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="Enter your ID"
                  style={{ minHeight: '44px' }}
                />
              </div>

              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                  PIN / Password
                </label>
                <input
                  type="password"
                  id="pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="Enter your PIN"
                  style={{ minHeight: '44px' }}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  style={{ minWidth: '20px', minHeight: '20px' }}
                />
                <label htmlFor="remember" className="ml-3 text-sm text-gray-700">
                  Remember me on this device
                </label>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                style={{ minHeight: '52px' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            {biometricAvailable && rememberMe && surveyorId && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBiometricLogin}
                  disabled={isLoading}
                  className="w-full py-4 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  style={{ minHeight: '52px' }}
                >
                  <Fingerprint className="w-5 h-5" />
                  Login with Biometrics
                </button>
              </div>
            )}

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>Demo credentials: SV001 / 1234</p>
              <p className="mt-1">Use "LOCKED" as ID to test locked account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}