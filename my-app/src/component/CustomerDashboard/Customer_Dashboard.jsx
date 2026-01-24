"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Download, Eye, X, Check, Clock, FileText, User, Lock, Mail, Phone, Bell, LogOut, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

// Mock data
const mockUser = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    notifications: {
        email: true,
        sms: false
    }
};

const mockAppointments = [
    {
        id: 1,
        date: '2026-01-25',
        time: '10:00 AM',
        address: '123 Oak Street, Suite 100',
        surveyor: 'Sarah Johnson',
        status: 'confirmed',
        type: 'Site Survey'
    },
    {
        id: 2,
        date: '2026-01-15',
        time: '2:00 PM',
        address: '456 Pine Avenue',
        surveyor: 'Mike Chen',
        status: 'completed',
        type: 'Blueprint Review'
    },
    {
        id: 3,
        date: '2026-01-10',
        time: '11:30 AM',
        address: '789 Maple Drive',
        surveyor: 'Sarah Johnson',
        status: 'completed',
        type: 'Final Inspection'
    }
];

const mockDocuments = [
    {
        id: 1,
        name: 'Site Survey Blueprint - Oak Street',
        date: '2026-01-15',
        status: 'ready',
        formats: ['pdf', 'svg', 'csv']
    },
    {
        id: 2,
        name: 'Floor Plan - Maple Drive',
        date: '2026-01-10',
        status: 'delivered',
        formats: ['pdf', 'svg']
    },
    {
        id: 3,
        name: 'Elevation Drawing - Pine Avenue',
        date: '2026-01-20',
        status: 'processing',
        formats: ['pdf']
    }
];

const availableSlots = [
    { date: '2026-01-27', time: '9:00 AM' },
    { date: '2026-01-27', time: '2:00 PM' },
    { date: '2026-01-28', time: '10:30 AM' },
    { date: '2026-01-28', time: '3:00 PM' },
    { date: '2026-01-29', time: '11:00 AM' }
];

const CustomerDashboard = () => {
    const [currentView, setCurrentView] = useState('login');
    const [loginMethod, setLoginMethod] = useState('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bookingRef, setBookingRef] = useState('');
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState(mockAppointments);
    const [documents, setDocuments] = useState(mockDocuments);
    const [showPastAppointments, setShowPastAppointments] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [profileData, setProfileData] = useState(mockUser);

    // Check for existing token on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser(mockUser);
            setCurrentView('dashboard');
        }
    }, []);

    // Simulate WebSocket connection
    useEffect(() => {
        if (user) {
            const timer = setTimeout(() => setWsConnected(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [user]);

    // Simulate real-time updates
    useEffect(() => {
        if (wsConnected) {
            const interval = setInterval(() => {
                setDocuments(prev => prev.map(doc =>
                    doc.status === 'processing' && Math.random() > 0.7
                        ? { ...doc, status: 'ready' }
                        : doc
                ));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [wsConnected]);

    const handleLogin = (e) => {
        e.preventDefault();
        // In a real app, you would validate credentials here
        const token = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', token);
        setUser(mockUser);
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setCurrentView('login');
        setActiveTab('dashboard');
        setEmail('');
        setPassword('');
        setBookingRef('');
    };

    const handleDownload = (docName, format) => {
        alert(`Downloading ${docName} as ${format.toUpperCase()}`);
        // In a real app, you would trigger actual file download
    };

    const handleReschedule = (slot) => {
        setAppointments(prev => prev.map(apt =>
            apt.id === selectedAppointment.id
                ? {
                    ...apt,
                    date: slot.date,
                    time: slot.time,
                    status: 'confirmed'
                }
                : apt
        ));
        setShowRescheduleModal(false);
        setSelectedAppointment(null);
    };

    const handleCancel = () => {
        setAppointments(prev => prev.map(apt =>
            apt.id === selectedAppointment.id
                ? { ...apt, status: 'cancelled' }
                : apt
        ));
        setShowCancelModal(false);
        setSelectedAppointment(null);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setUser(profileData);
        setEditingProfile(false);
        alert('Profile updated successfully!');
    };

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNotificationChange = (type) => {
        setProfileData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: !prev.notifications[type]
            }
        }));
    };

    const upcomingAppointments = appointments.filter(apt =>
        new Date(apt.date) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed'
    );

    const pastAppointments = appointments.filter(apt =>
        new Date(apt.date) < new Date() || apt.status === 'cancelled' || apt.status === 'completed'
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'processing': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Login View
    if (currentView === 'login') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Customer Portal</h1>
                        <p className="text-gray-600 mt-2">Access your appointments and documents</p>
                    </div>

                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 py-2 rounded-lg transition ${loginMethod === 'email'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Email Login
                        </button>
                        <button
                            onClick={() => setLoginMethod('booking')}
                            className={`flex-1 py-2 rounded-lg transition ${loginMethod === 'booking'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Booking Reference
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {loginMethod === 'email' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentView('forgot-password')}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Booking Reference
                                </label>
                                <input
                                    type="text"
                                    value={bookingRef}
                                    onChange={(e) => setBookingRef(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="BK-123456"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Forgot Password View
    if (currentView === 'forgot-password') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
                    <p className="text-gray-600 mb-6">Enter your email to receive a password reset link</p>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        alert('Password reset link sent to your email!');
                        setCurrentView('login');
                    }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Send Reset Link
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentView('login')}
                            className="w-full text-gray-600 hover:text-gray-800 transition"
                        >
                            Back to Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Main Dashboard View
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Customer Portal</h1>
                    <div className="flex items-center gap-4">
                        {wsConnected && (
                            <div className="flex items-center gap-2 text-green-600 text-sm">
                                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                                Live
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1">
                        {['dashboard', 'documents', 'profile'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 font-medium transition capitalize ${activeTab === tab
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
                            <p className="opacity-90">Here's an overview of your appointments and documents</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
                            {upcomingAppointments.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingAppointments.map((apt) => (
                                        <div key={apt.id} className="border rounded-lg p-4 hover:border-blue-500 transition">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Calendar className="h-5 w-5 text-blue-600" />
                                                        <span className="font-semibold text-gray-800">
                                                            {new Date(apt.date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                        <span className="text-gray-600">at {apt.time}</span>
                                                    </div>
                                                    <p className="text-gray-600 ml-7">{apt.address}</p>
                                                    <div className="flex flex-wrap gap-2 ml-7 mt-2">
                                                        <span className="text-sm text-gray-600">Surveyor: {apt.surveyor}</span>
                                                        <span className={`text-sm px-2 py-1 rounded ${getStatusColor(apt.status)}`}>
                                                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAppointment(apt);
                                                            setShowDetailsModal(true);
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Details
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAppointment(apt);
                                                            setShowRescheduleModal(true);
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                                    >
                                                        <Calendar className="h-4 w-4" />
                                                        Reschedule
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAppointment(apt);
                                                            setShowCancelModal(true);
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <button
                                onClick={() => setShowPastAppointments(!showPastAppointments)}
                                className="w-full flex items-center justify-between text-xl font-bold text-gray-800 mb-4"
                            >
                                <span>Past Appointments ({pastAppointments.length})</span>
                                <span className={`transform transition ${showPastAppointments ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {showPastAppointments && pastAppointments.length > 0 ? (
                                <div className="space-y-3">
                                    {pastAppointments.map((apt) => (
                                        <div key={apt.id} className="border rounded-lg p-4 bg-gray-50">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-700">
                                                            {new Date(apt.date).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-gray-600">{apt.time}</span>
                                                        <span className={`text-sm px-2 py-1 rounded ${getStatusColor(apt.status)}`}>
                                                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{apt.type} - {apt.address}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSelectedAppointment(apt);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No past appointments</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Documents</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Document</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                    <span className="font-medium text-gray-800">{doc.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">{doc.date}</td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${doc.status === 'ready' ? 'bg-green-100 text-green-700' :
                                                        doc.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {doc.status === 'ready' && <CheckCircle className="h-4 w-4" />}
                                                    {doc.status === 'processing' && <Clock className="h-4 w-4" />}
                                                    {doc.status === 'delivered' && <Check className="h-4 w-4" />}
                                                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {doc.status !== 'processing' ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {doc.formats.map((format) => (
                                                            <button
                                                                key={format}
                                                                onClick={() => handleDownload(doc.name, format)}
                                                                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                            >
                                                                <Download className="h-3 w-3" />
                                                                {format.toUpperCase()}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">Processing...</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Profile Settings</h3>
                            <button
                                onClick={() => {
                                    if (editingProfile) {
                                        setProfileData(user); // Reset to original data
                                    }
                                    setEditingProfile(!editingProfile);
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                            >
                                <Edit2 className="h-4 w-4" />
                                {editingProfile ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile}>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-4">Contact Information</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => handleProfileChange('name', e.target.value)}
                                                    disabled={!editingProfile}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => handleProfileChange('email', e.target.value)}
                                                    disabled={!editingProfile}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                                                    disabled={!editingProfile}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-gray-800 mb-4">Security</h4>
                                    <button
                                        type="button"
                                        onClick={() => alert('Password change functionality would go here')}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        <Lock className="h-4 w-4" />
                                        Change Password
                                    </button>
                                </div>

                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        Notification Preferences
                                    </h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={profileData.notifications.email}
                                                onChange={() => handleNotificationChange('email')}
                                                disabled={!editingProfile}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">Email notifications</span>
                                        </label>
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={profileData.notifications.sms}
                                                onChange={() => handleNotificationChange('sms')}
                                                disabled={!editingProfile}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">SMS notifications</span>
                                        </label>
                                    </div>
                                </div>

                                {editingProfile && (
                                    <div className="border-t pt-6">
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </main>

            {/* Reschedule Modal */}
            {showRescheduleModal && (
               <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Reschedule Appointment</h3>
                            <button
                                onClick={() => setShowRescheduleModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">Select a new time slot:</p>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {availableSlots.map((slot, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleReschedule(slot)}
                                    className="w-full text-left px-4 py-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                                >
                                    <div className="font-medium text-gray-800">
                                        {new Date(slot.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-gray-600 text-sm">{slot.time}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
               <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Cancel Appointment</h3>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mb-6">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <p className="text-gray-600 text-center">
                                Are you sure you want to cancel this appointment? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Keep Appointment
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Appointment Details Modal */}
            {showDetailsModal && selectedAppointment && (
                <div className="fixed inset-0 backdrop-blur-lg bg-white/20 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Appointment Details</h3>
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="font-medium text-gray-800">{selectedAppointment.type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Date & Time</p>
                            <p className="font-medium text-gray-800">
                                {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} at {selectedAppointment.time}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium text-gray-800">{selectedAppointment.address}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Surveyor</p>
                            <p className="font-medium text-gray-800">{selectedAppointment.surveyor}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)}`}>
                                {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowDetailsModal(false)}
                        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
            )}
        </div>
    );
};

export default CustomerDashboard;