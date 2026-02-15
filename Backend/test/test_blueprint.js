import axios from 'axios';
import mongoose from 'mongoose'; // For ObjectId generation if needed, but we'll let the server handle it
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:8000/api';
const TEST_USER = {
    fullName: "Blueprint Tester",
    email: `tester_${Date.now()}@example.com`,
    password: "password123",
    role: "Planner"
};

const SAMPLE_SURVEY = {
    // We need an appointment ID, but the survey controller might check for it.
    // Let's see if we can create a survey without a real appointment first, 
    // or if we need to mock that too. 
    // Looking at survey.controller.js (not viewed yet but assuming), let's try a direct insert or flow.
    // Actually, let's try to just hit the generate endpoint.
    // But we need a valid survey in DB. 
    // Let's insert a survey via API if possible, or assume one exists.
    // Better: Submit a survey first.

    apptid: new mongoose.Types.ObjectId(), // Random ID
    siteLocation: {
        address: "123 Test St",
        coordinates: [72.0, 19.0]
    },
    rooms: [
        { room_type: "Hall", length_m: 5, angle_deg: 90, height_m: 3 },
        { room_type: "Hall", length_m: 5, angle_deg: 90, height_m: 3 },
        { room_type: "Hall", length_m: 5, angle_deg: 90, height_m: 3 },
        { room_type: "Hall", length_m: 5, angle_deg: 90, height_m: 3 }
    ],
    checksum: "mock_sha256"
};

async function testBlueprintFlow() {
    console.log("🚀 Starting Blueprint Generation Test...");

    try {
        // 1. Login/Register
        console.log("\n1️⃣  Authenticating...");
        await axios.post(`${BASE_URL}/auth/register`, TEST_USER).catch(() => { }); // Ignore if exists
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        const token = loginRes.data.data.token;
        console.log("   ✅ Authenticated");

        // 2. Create a Survey
        // We'll use the survey submission endpoint if it exists and is open, 
        // or we might need to manually insert if the survey service is not fully ready.
        // Let's try the survey route from `server.js` -> `surveyRoutes`.
        console.log("\n2️⃣  Submitting Test Survey...");

        // Note: We haven't fully implemented/verified Survey Controller yet in this session, 
        // but it existed in the file list. Let's hope it works or we might need to fix it.
        // If it fails, we know we need to work on Survey Service next.
        const surveyRes = await axios.post(`${BASE_URL}/surveys/submit`, SAMPLE_SURVEY, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const surveyId = surveyRes.data.data._id;
        console.log(`   ✅ Survey Submitted: ${surveyId}`);

        // 3. Generate Blueprint
        console.log(`\n3️⃣  Generating Blueprint for Survey ${surveyId}...`);
        const blueprintRes = await axios.post(`${BASE_URL}/blueprints/generate/${surveyId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("   ✅ Blueprint Generated!");
        console.log("   Blueprint ID:", blueprintRes.data.data._id);
        console.log("   SVG Data Length:", blueprintRes.data.data.svgData.length);

        if (blueprintRes.data.data.status !== 'Pending' && blueprintRes.data.data.status !== 'Review Needed') {
            console.warn("   ⚠️ Unexpected Status:", blueprintRes.data.data.status);
        }

        console.log("\n✨ BLUEPRINT FLOW VERIFIED ✨");

    } catch (error) {
        console.error("\n❌ TEST FAILED ❌");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testBlueprintFlow();
