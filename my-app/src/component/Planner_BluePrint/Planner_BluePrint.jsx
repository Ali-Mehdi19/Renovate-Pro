'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  Download, ZoomIn, ZoomOut, Move, Ruler, MessageSquare, AlertCircle, 
  Share2, Eye, EyeOff, Undo, Redo, Save, ArrowLeft, Maximize2, 
  Minimize2, RotateCw, Grid, Home, Plus, Minus, X, Check
} from 'lucide-react';

const BlueprintViewer = () => {
  const router = useRouter();
  const [layers, setLayers] = useState({
    walls: true,
    doors: true,
    dimensions: true,
    labels: true,
    furniture: true,
    grid: true
  });
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [comments, setComments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [showAudit, setShowAudit] = useState(false);
  const [exportFormat, setExportFormat] = useState('svg');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDimensions, setShowDimensions] = useState(true);
  const [rotation, setRotation] = useState(0);
  
  const svgRef = useRef(null);
  const transformRef = useRef(null);
  const containerRef = useRef(null);

  // Sample blueprint data
  const rooms = [
    { id: 1, name: 'Living Room', x: 100, y: 100, width: 400, height: 300, area: 120, color: '#3b82f6' },
    { id: 2, name: 'Kitchen', x: 100, y: 420, width: 200, height: 200, area: 40, color: '#10b981' },
    { id: 3, name: 'Bedroom', x: 520, y: 100, width: 300, height: 300, area: 90, color: '#8b5cf6' },
    { id: 4, name: 'Bathroom', x: 320, y: 420, width: 180, height: 200, area: 36, color: '#f59e0b' }
  ];

  const doors = [
    { id: 1, x: 180, y: 400, width: 100, height: 15, rotation: 0 },
    { id: 2, x: 470, y: 200, width: 15, height: 80, rotation: 0 },
    { id: 3, x: 400, y: 420, width: 100, height: 15, rotation: 0 }
  ];

  const furniture = [
    { id: 1, type: 'sofa', x: 180, y: 180, width: 150, height: 70, color: '#6b7280' },
    { id: 2, type: 'dining-table', x: 150, y: 480, width: 100, height: 100, color: '#8b5cf6' },
    { id: 3, type: 'bed', x: 580, y: 180, width: 140, height: 200, color: '#10b981' },
    { id: 4, type: 'wardrobe', x: 580, y: 400, width: 60, height: 100, color: '#f59e0b' }
  ];

  // Initialize transform functions
  useEffect(() => {
    if (transformRef.current) {
      transformRef.current.resetTransform();
    }
  }, []);

  const addToAuditLog = (action, details) => {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      checksum: Math.random().toString(36).substr(2, 9)
    };
    setAuditLog(prev => [entry, ...prev]);
  };

  const handleLayerToggle = (layer) => {
    setLayers(prev => {
      const newLayers = { ...prev, [layer]: !prev[layer] };
      addToAuditLog('Layer Toggle', `${layer}: ${newLayers[layer] ? 'shown' : 'hidden'}`);
      return newLayers;
    });
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    addToAuditLog('Room Selected', `${room.name} selected`);
  };

  const handleMeasureClick = (e) => {
    if (!measureMode || !svgRef.current) return;
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const pt = svg.createSVGPoint();
    pt.x = e.clientX - rect.left;
    pt.y = e.clientY - rect.top;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    
    setMeasurePoints(prev => {
      const newPoints = [...prev, { x: svgP.x, y: svgP.y }];
      if (newPoints.length === 2) {
        const distance = Math.sqrt(
          Math.pow(newPoints[1].x - newPoints[0].x, 2) +
          Math.pow(newPoints[1].y - newPoints[0].y, 2)
        );
        const distanceInMeters = (distance / 50).toFixed(2);
        addToAuditLog('Measurement', `Distance: ${distanceInMeters}m`);
        return newPoints;
      }
      return newPoints;
    });
  };

  const clearMeasurements = () => {
    setMeasurePoints([]);
  };

  const addComment = () => {
    if (!selectedRoom) {
      alert('Please select a room first');
      return;
    }
    const comment = prompt('Enter comment:');
    if (comment) {
      const newComment = {
        id: Date.now(),
        roomId: selectedRoom.id,
        text: comment,
        timestamp: new Date().toISOString()
      };
      setComments(prev => [...prev, newComment]);
      addToAuditLog('Comment Added', `${selectedRoom.name}: ${comment}`);
    }
  };

  const addIssue = () => {
    if (!selectedRoom) {
      alert('Please select a room first');
      return;
    }
    const issue = prompt('Describe the issue:');
    if (issue) {
      const newIssue = {
        id: Date.now(),
        roomId: selectedRoom.id,
        text: issue,
        timestamp: new Date().toISOString(),
        status: 'open'
      };
      setIssues(prev => [...prev, newIssue]);
      addToAuditLog('Issue Reported', `${selectedRoom.name}: ${issue}`);
    }
  };

  const handleExport = () => {
    addToAuditLog('Export', `Format: ${exportFormat}`);
    
    if (exportFormat === 'svg') {
      const svgData = svgRef.current.outerHTML;
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blueprint.svg';
      a.click();
    } else if (exportFormat === 'json') {
      const data = { rooms, doors, furniture, comments, issues, layers };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blueprint.json';
      a.click();
    }
    alert(`Blueprint exported as ${exportFormat.toUpperCase()}`);
  };

  const downloadAuditLog = () => {
    const blob = new Blob([JSON.stringify(auditLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-log.json';
    a.click();
  };

  const calculateDistance = () => {
    if (measurePoints.length === 2) {
      const distance = Math.sqrt(
        Math.pow(measurePoints[1].x - measurePoints[0].x, 2) +
        Math.pow(measurePoints[1].y - measurePoints[0].y, 2)
      );
      return (distance / 50).toFixed(2);
    }
    return null;
  };

  const handleZoomIn = () => {
    if (transformRef.current) {
      transformRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (transformRef.current) {
      transformRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (transformRef.current) {
      transformRef.current.resetTransform();
      setRotation(0);
    }
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleBack = () => {
    router.back();
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex h-screen bg-gray-900 text-white">
      {/* Layer Control Panel */}
      <div className="w-64 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Blueprint Controls</h2>
        </div>
        
        <div className="space-y-3">
          {Object.entries(layers).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <button
                onClick={() => handleLayerToggle(key)}
                className={`p-2 rounded ${value ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                {value ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="font-bold mb-3">Tools</h3>
          <div className="space-y-2">
            <button
              onClick={() => setMeasureMode(!measureMode)}
              className={`w-full flex items-center gap-2 p-2 rounded ${
                measureMode ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              <Ruler size={16} />
              {measureMode ? 'Measuring...' : 'Measure'}
              {measureMode && (
                <span className="ml-auto text-xs">
                  Click two points
                </span>
              )}
            </button>
            {measureMode && measurePoints.length > 0 && (
              <button
                onClick={clearMeasurements}
                className="w-full flex items-center gap-2 p-2 rounded bg-red-600"
              >
                <X size={16} />
                Clear Measurements
              </button>
            )}
            <button
              onClick={addComment}
              disabled={!selectedRoom}
              className="w-full flex items-center gap-2 p-2 rounded bg-gray-700 disabled:opacity-50"
            >
              <MessageSquare size={16} />
              Add Comment
            </button>
            <button
              onClick={addIssue}
              disabled={!selectedRoom}
              className="w-full flex items-center gap-2 p-2 rounded bg-red-600 disabled:opacity-50"
            >
              <AlertCircle size={16} />
              Report Issue
            </button>
            <button
              onClick={handleRotate}
              className="w-full flex items-center gap-2 p-2 rounded bg-purple-600"
            >
              <RotateCw size={16} />
              Rotate 90°
            </button>
          </div>
        </div>

        {selectedRoom && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-bold mb-2">Selected Room</h3>
            <div className="bg-gray-700 p-3 rounded">
              <p className="font-semibold text-lg">{selectedRoom.name}</p>
              <p className="text-sm text-gray-300">Area: {selectedRoom.area}m²</p>
              <p className="text-sm text-gray-300">
                Dimensions: {selectedRoom.width/50}m × {selectedRoom.height/50}m
              </p>
            </div>
          </div>
        )}

        {measurePoints.length === 2 && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-bold mb-2">Measurement</h3>
            <div className="bg-blue-900 p-3 rounded">
              <p className="text-lg font-bold">{calculateDistance()} meters</p>
              <p className="text-sm text-blue-300">Between two selected points</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Viewer */}
      <div className="flex-1 relative bg-gray-800">
        {/* Top Controls */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded hover:bg-gray-700 transition"
            title="Zoom In"
          >
            <Plus size={20} />
          </button>
          <span className="px-3 py-1 bg-gray-700 rounded text-sm">
            {scale.toFixed(1)}x
          </span>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded hover:bg-gray-700 transition"
            title="Zoom Out"
          >
            <Minus size={20} />
          </button>
          <div className="w-px h-6 bg-gray-600 mx-2"></div>
          <button
            onClick={handleResetView}
            className="p-2 rounded hover:bg-gray-700 transition"
            title="Reset View"
          >
            <Home size={20} />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 rounded hover:bg-gray-700 transition"
            title="Rotate"
          >
            <RotateCw size={20} />
          </button>
          <div className="w-px h-6 bg-gray-600 mx-2"></div>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded hover:bg-gray-700 transition"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        {/* Right Side Controls */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-2 bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <button
            onClick={addComment}
            className="p-2 rounded hover:bg-gray-700 transition"
            title="Add Comment"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`p-2 rounded transition ${showDimensions ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            title="Toggle Dimensions"
          >
            <Ruler size={20} />
          </button>
          <button
            onClick={() => setMeasureMode(!measureMode)}
            className={`p-2 rounded transition ${measureMode ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            title="Measure Distance"
          >
            <AlertCircle size={20} />
          </button>
        </div>

        {/* Blueprint Container */}
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.1}
          maxScale={8}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          panning={{ disabled: false }}
          onZoom={(ref) => setScale(ref.state.scale)}
          onPanning={(ref) => setPosition(ref.state.position)}
        >
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <>
              <TransformComponent wrapperClass="w-full h-full">
                <svg
                  ref={svgRef}
                  viewBox="0 0 1000 800"
                  className="w-full h-full bg-gray-900"
                  onClick={handleMeasureClick}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  {/* Grid */}
                  {layers.grid && (
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="1"/>
                      </pattern>
                    </defs>
                  )}
                  <rect width="100%" height="100%" fill={layers.grid ? "url(#grid)" : "#111827"} />

                  {/* Rooms */}
                  {layers.walls && rooms.map(room => (
                    <g key={room.id}>
                      <rect
                        x={room.x}
                        y={room.y}
                        width={room.width}
                        height={room.height}
                        fill={selectedRoom?.id === room.id ? room.color + '80' : room.color + '40'}
                        stroke={selectedRoom?.id === room.id ? room.color : '#6b7280'}
                        strokeWidth={selectedRoom?.id === room.id ? "4" : "2"}
                        className="cursor-pointer hover:stroke-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoomClick(room);
                        }}
                      />
                      {showDimensions && layers.dimensions && (
                        <>
                          <text
                            x={room.x + room.width/2}
                            y={room.y - 10}
                            textAnchor="middle"
                            fill="#60a5fa"
                            fontSize="14"
                            fontWeight="bold"
                          >
                            {room.width/50}m
                          </text>
                          <text
                            x={room.x - 10}
                            y={room.y + room.height/2}
                            textAnchor="end"
                            fill="#60a5fa"
                            fontSize="14"
                            fontWeight="bold"
                          >
                            {room.height/50}m
                          </text>
                        </>
                      )}
                    </g>
                  ))}

                  {/* Doors */}
                  {layers.doors && doors.map(door => (
                    <rect
                      key={door.id}
                      x={door.x}
                      y={door.y}
                      width={door.width}
                      height={door.height}
                      fill="#f59e0b"
                      stroke="#d97706"
                      strokeWidth="2"
                      rx="2"
                    />
                  ))}

                  {/* Room Labels */}
                  {layers.labels && rooms.map(room => (
                    <text
                      key={`label-${room.id}`}
                      x={room.x + room.width / 2}
                      y={room.y + room.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize="20"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {room.name}
                      <tspan x={room.x + room.width / 2} dy="25" fontSize="14" fill="#d1d5db">
                        {room.area}m²
                      </tspan>
                    </text>
                  ))}

                  {/* Furniture */}
                  {layers.furniture && furniture.map(item => (
                    <rect
                      key={item.id}
                      x={item.x}
                      y={item.y}
                      width={item.width}
                      height={item.height}
                      fill={item.color + '60'}
                      stroke={item.color}
                      strokeWidth="2"
                      rx="4"
                    />
                  ))}

                  {/* Issues */}
                  {issues.map(issue => {
                    const room = rooms.find(r => r.id === issue.roomId);
                    return room ? (
                      <g key={issue.id}>
                        <circle
                          cx={room.x + room.width - 30}
                          cy={room.y + 30}
                          r="12"
                          fill="#ef4444"
                          stroke="#fff"
                          strokeWidth="2"
                        />
                        <text
                          x={room.x + room.width - 30}
                          y={room.y + 35}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          !
                        </text>
                      </g>
                    ) : null;
                  })}

                  {/* Measurement Line */}
                  {measurePoints.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="8"
                      fill="#3b82f6"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  ))}
                  {measurePoints.length === 2 && (
                    <>
                      <line
                        x1={measurePoints[0].x}
                        y1={measurePoints[0].y}
                        x2={measurePoints[1].x}
                        y2={measurePoints[1].y}
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />
                      <text
                        x={(measurePoints[0].x + measurePoints[1].x) / 2}
                        y={(measurePoints[0].y + measurePoints[1].y) / 2 - 10}
                        textAnchor="middle"
                        fill="#3b82f6"
                        fontSize="16"
                        fontWeight="bold"
                      >
                        {calculateDistance()}m
                      </text>
                    </>
                  )}
                </svg>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Selected Room</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Furniture</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Doors</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {measureMode ? 'Click two points to measure distance' : 'Drag to pan, Scroll to zoom'}
          </div>
          <div className="text-sm">
            Scale: {scale.toFixed(2)}x
          </div>
        </div>
      </div>

      {/* Export & Audit Panel */}
      <div className="w-80 bg-gray-800 p-4 overflow-y-auto border-l border-gray-700">
        <h2 className="text-xl font-bold mb-4">Export & Audit</h2>
        
        <div className="mb-6">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded mb-3"
          >
            <option value="svg">SVG (Vector)</option>
            <option value="pdf">PDF (Document)</option>
            <option value="dxf">DXF (CAD)</option>
            <option value="json">JSON (Data)</option>
          </select>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Download size={18} />
            Export Blueprint
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-green-600 p-3 rounded-lg hover:bg-green-700 transition mt-3">
            <Share2 size={18} />
            Share Blueprint
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-purple-600 p-3 rounded-lg hover:bg-purple-700 transition mt-3">
            <Save size={18} />
            Save Changes
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Audit Log</h2>
            <button
              onClick={() => setShowAudit(!showAudit)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {showAudit ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showAudit && (
            <>
              <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                {auditLog.map((entry, i) => (
                  <div key={i} className="bg-gray-700 p-3 rounded-lg">
                    <div className="font-semibold text-blue-400 flex items-center justify-between">
                      <span>{entry.action}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm mt-1">{entry.details}</div>
                    <div className="text-gray-500 text-xs mt-2 flex justify-between">
                      <span>Checksum: {entry.checksum}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={downloadAuditLog}
                className="w-full flex items-center justify-center gap-2 bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition"
              >
                <Download size={18} />
                Download Audit Trail
              </button>
            </>
          )}
        </div>

        {comments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-bold mb-3">Comments ({comments.length})</h3>
            <div className="space-y-3">
              {comments.map(comment => {
                const room = rooms.find(r => r.id === comment.roomId);
                return (
                  <div key={comment.id} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-blue-300">{room?.name}</div>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-gray-200">{comment.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {issues.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-bold mb-3 text-red-400">Issues ({issues.length})</h3>
            <div className="space-y-3">
              {issues.map(issue => {
                const room = rooms.find(r => r.id === issue.roomId);
                return (
                  <div key={issue.id} className="bg-red-900/30 p-3 rounded-lg border border-red-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-red-300">{room?.name}</div>
                      <span className="text-xs bg-red-600 px-2 py-1 rounded-full">
                        {issue.status}
                      </span>
                    </div>
                    <div className="text-gray-200">{issue.text}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(issue.timestamp).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlueprintViewer;