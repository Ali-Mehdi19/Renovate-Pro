
import { resolveVertices } from './services/geometricCore.js';
import { generateCompleteBlueprint } from './services/svgRenderer.js';
import fs from 'fs';

// Mock Multi-Room Data
// 1. Living Room (Rectangle 5x4)
// 2. Kitchen (Square 3x3)
const mockSurveyRooms = [
    // Living Room Walls
    { room_type: "Living Room", length_m: 5, angle_deg: 0 },
    { room_type: "Living Room", length_m: 4, angle_deg: 90 },
    { room_type: "Living Room", length_m: 5, angle_deg: 90 },
    { room_type: "Living Room", length_m: 4, angle_deg: 90 },

    // Kitchen Walls
    { room_type: "Kitchen", length_m: 3, angle_deg: 0 },
    { room_type: "Kitchen", length_m: 3, angle_deg: 90 },
    { room_type: "Kitchen", length_m: 3, angle_deg: 90 },
    { room_type: "Kitchen", length_m: 3, angle_deg: 90 }
];

// Logic Mirroring Controller
console.log("1. Separating Rooms...");
const roomsMap = {};
mockSurveyRooms.forEach(wall => {
    if (!roomsMap[wall.room_type]) roomsMap[wall.room_type] = [];
    roomsMap[wall.room_type].push(wall);
});

console.log("2. Processing Geometry...");
const processedRooms = [];
for (const [roomType, walls] of Object.entries(roomsMap)) {
    console.log(`   - Processing ${roomType}`);
    const vertices = resolveVertices(walls);
    processedRooms.push({
        name: roomType,
        walls: walls,
        vertices: vertices
    });
}

console.log("3. Rendering SVG...");
const svg = generateCompleteBlueprint(processedRooms);

// Save File
const fileName = 'verification_full_house.svg';
fs.writeFileSync(fileName, svg);
console.log(`✅ Success! SVG saved to ${fileName}`);
console.log("Preview of SVG Content:");
console.log(svg.substring(0, 500) + "...");
