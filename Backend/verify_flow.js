import axios from 'axios';
import mongoose from 'mongoose';

const BASE_URL = 'http://localhost:8000/api';

// Generate a random ObjectID-like string for the Appointment ID (mock)
const generateObjectId = () => {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

const mockApptId = generateObjectId();

const sampleSurvey = {
    apptid: mockApptId,
    siteLocation: {
        address: "123 Verification Lane, Mumbai",
        coordinates: [72.8777, 19.0760]
    },
    rooms: [
        {
            room_type: "Master Bedroom",
            length_m: 5.0,
            angle_deg: 90,
            height_m: 3.0,
            features: []
        },
        {
            room_type: "Hallway",
            length_m: 3.0,
            angle_deg: 90,
            height_m: 2.8,
            features: []
        },
        {
            room_type: "Kitchen",
            length_m: 4.5,
            angle_deg: 90,
            height_m: 3.0,
            features: []
        },
        {
            room_type: "Balcony",
            length_m: 2.0,
            angle_deg: 90,
            height_m: 3.0,
            features: []
        }
    ]
};

async function runTest() {
    console.log("🚀 Starting End-to-End Verification...");
    console.log(`Test Survey ApptID: ${mockApptId}`);

    try {
        // Step 1: Submit Survey
        console.log("\n1️⃣  Submitting Survey...");
        const submitRes = await axios.post(`${BASE_URL}/surveys/submit`, sampleSurvey);

        if (submitRes.status !== 201) {
            throw new Error(`Submit failed with status: ${submitRes.status}`);
        }

        const surveyData = submitRes.data.data;
        console.log("   ✅ Survey Submitted!");
        console.log("   Survey ID:", surveyData._id);

        // Step 2: Verify Blueprint Generation
        console.log("\n2️⃣  Verifying Blueprint Generation...");

        // Find the blueprint associated with this survey
        const blueprintsRes = await axios.get(`${BASE_URL}/planners`);
        const allBlueprints = blueprintsRes.data.data;

        const myBlueprint = allBlueprints.find(bp => {
            // Populate might return object, or just ID
            const id = bp.surveyid._id || bp.surveyid;
            return id === surveyData._id;
        });

        if (!myBlueprint) {
            throw new Error("❌ Blueprint was NOT generated for the submitted survey.");
        }

        console.log("   ✅ Blueprint Found!");
        console.log("   Blueprint ID:", myBlueprint._id);
        console.log("   Status:", myBlueprint.status);
        console.log("   Created At:", myBlueprint.createdAt);

        // Step 3: Validate SVG Content
        console.log("\n3️⃣  Validating SVG Content...");
        if (!myBlueprint.svgData) {
            throw new Error("❌ SVG Data is missing in the blueprint.");
        }

        console.log("   SVG Length:", myBlueprint.svgData.length);
        if (myBlueprint.svgData.includes("<svg") && myBlueprint.svgData.includes("Master Bedroom")) {
            console.log("   ✅ SVG Content looks valid (contains tags and room type).");
        } else {
            console.warn("   ⚠️ SVG Content might be malformed or simple.");
        }

        console.log("\n✨ VERIFICATION SUCCESSFUL ✨");

    } catch (error) {
        console.error("\n❌ VERIFICATION FAILED ❌");
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Server Response:", error.response.data);
            console.error("Status Code:", error.response.status);
        }
    }
}

runTest();
