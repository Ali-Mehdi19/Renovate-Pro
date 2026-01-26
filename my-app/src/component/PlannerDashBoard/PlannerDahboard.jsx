"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Filter, Download, Check, X, Grid, BarChart2, Calendar, MapPin, User, Clock } from 'lucide-react';

// Mock data generator
const generateMockProjects = (count) => {
  const statuses = ['Processing', 'Review', 'Ready'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];
  const names = ['Residential Complex A', 'Commercial Tower B', 'Villa Project C', 'Apartment Block D', 'Office Space E'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `proj-${i + 1}`,
    name: `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
    address: `${Math.floor(Math.random() * 999) + 1} Street, ${locations[i % locations.length]}`,
    status: statuses[i % statuses.length],
    customer: `Customer ${String.fromCharCode(65 + (i % 26))}`,
    contact: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    surveyDate: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
    turnaroundDays: Math.floor(Math.random() * 15) + 5,
    thumbnail: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23${Math.floor(Math.random()*16777215).toString(16)}'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='white' text-anchor='middle' dominant-baseline='middle'%3EBlueprint ${i + 1}%3C/text%3E%3C/svg%3E`
  }));
};

const PlannerDashboard = () => {
  const [projects, setProjects] = useState(generateMockProjects(50));
  const [selectedProjects, setSelectedProjects] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    location: 'all',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(true);
  const [draggedProject, setDraggedProject] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'a':
            e.preventDefault();
            setSelectedProjects(new Set(filteredProjects.map(p => p.id)));
            break;
          case 'd':
            e.preventDefault();
            setSelectedProjects(new Set());
            break;
          case 'e':
            e.preventDefault();
            if (selectedProjects.size > 0) handleBulkExport('pdf');
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedProjects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           project.address.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesLocation = filters.location === 'all' || project.address.includes(filters.location);
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [projects, debouncedSearch, filters]);

  // Statistics calculations
  const stats = useMemo(() => {
    const statusCounts = projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});

    const avgTurnaround = projects.reduce((sum, p) => sum + p.turnaroundDays, 0) / projects.length;

    const weeklyData = Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      count: Math.floor(Math.random() * 15) + 5
    }));

    return { statusCounts, avgTurnaround, weeklyData };
  }, [projects]);

  const pieData = Object.entries(stats.statusCounts).map(([name, value]) => ({ name, value }));
  const COLORS = { Processing: '#3b82f6', Review: '#f59e0b', Ready: '#10b981' };

  const handleProjectClick = (projectId) => {
    window.location.href = `/planner/blueprint/${projectId}`;
  };

  const toggleProjectSelection = (projectId, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const handleBulkExport = (format) => {
    alert(`Exporting ${selectedProjects.size} projects as ${format.toUpperCase()}`);
  };

  const handleBulkStatusUpdate = (newStatus) => {
    setProjects(projects.map(p => 
      selectedProjects.has(p.id) ? { ...p, status: newStatus } : p
    ));
    setSelectedProjects(new Set());
  };

  const handleDragStart = (e, project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetProject) => {
    e.preventDefault();
    if (draggedProject && draggedProject.id !== targetProject.id) {
      const draggedIndex = projects.findIndex(p => p.id === draggedProject.id);
      const targetIndex = projects.findIndex(p => p.id === targetProject.id);
      const newProjects = [...projects];
      newProjects.splice(draggedIndex, 1);
      newProjects.splice(targetIndex, 0, draggedProject);
      setProjects(newProjects);
    }
    setDraggedProject(null);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      Processing: 'bg-blue-100 text-blue-800',
      Review: 'bg-amber-100 text-amber-800',
      Ready: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Project Planner</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Grid className="w-4 h-4" />
                View
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bulk Actions */}
          {selectedProjects.size > 0 && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                {selectedProjects.size} selected
              </span>
              <button
                onClick={() => handleBulkExport('svg')}
                className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
              >
                Export SVG
              </button>
              <button
                onClick={() => handleBulkExport('pdf')}
                className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
              >
                Export PDF
              </button>
              <button
                onClick={() => handleBulkExport('csv')}
                className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
              >
                Export CSV
              </button>
              <select
                onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                className="px-3 py-1 text-sm border border-blue-300 rounded hover:bg-blue-50"
                defaultValue=""
              >
                <option value="" disabled>Update Status</option>
                <option value="Processing">Processing</option>
                <option value="Review">Review</option>
                <option value="Ready">Ready</option>
              </select>
              <button
                onClick={() => setSelectedProjects(new Set())}
                className="ml-auto px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Filter Sidebar */}
        {showFilters && (
          <aside className="w-64 bg-white border-r border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Processing">Processing</option>
                  <option value="Review">Review</option>
                  <option value="Ready">Ready</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({ status: 'all', location: 'all', dateRange: 'all' })}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Project Grid */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredProjects.length} of {projects.length} projects
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, project)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, project)}
                    onClick={() => handleProjectClick(project.id)}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${
                      selectedProjects.has(project.id) ? 'ring-2 ring-blue-500' : ''
                    } ${draggedProject?.id === project.id ? 'opacity-50' : ''}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-40 bg-gray-100">
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        onClick={(e) => toggleProjectSelection(project.id, e)}
                        className={`absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer ${
                          selectedProjects.has(project.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {selectedProjects.has(project.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <StatusBadge status={project.status} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        {project.address}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{project.customer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{project.surveyDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{project.turnaroundDays} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Sidebar */}
            <aside className="w-80 space-y-6">
              {/* Status Distribution */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5" />
                  Projects by Status
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Average Turnaround */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-2">Average Turnaround</h3>
                <div className="text-4xl font-bold text-blue-600">
                  {stats.avgTurnaround.toFixed(1)}
                  <span className="text-lg text-gray-600 ml-2">days</span>
                </div>
              </div>

              {/* Weekly Throughput */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Throughput</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={stats.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-3">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Select All</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+A</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deselect All</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+D</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Export PDF</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+E</kbd>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlannerDashboard;