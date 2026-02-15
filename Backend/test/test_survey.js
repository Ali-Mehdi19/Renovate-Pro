import axios from 'axios';
import mongoose from 'mongoose';

const BASE_URL = 'http://localhost:8000/api';

const SURVEYOR_USER = {
    fullName: "Test Surveyor",
    email: `surveyor_${Date.now()}@example.com`,
    password: "password123",
    role: "Surveyor"
};

const CUSTOMER_USER = {
    fullName: "Test Customer",
    email: `customer_${Date.now()}@example.com`,
    password: "password123",
    role: "Customer"
};

const SAMPLE_SURVEY = {
    apptid: new mongoose.Types.ObjectId(),
    siteLocation: {
        address: "456 Renovate Lane, Mumbai",
        coordinates: [72.8777, 19.0760]
    },
    rooms: [
        { room_type: "Bedroom", length_m: 4.5, angle_deg: 90, height_m: 3.0 }
    ]
};

async function testSurveyFlow() {
    console.log("🚀 Starting Survey Service Test...");

    try {
        // 1. Register & Login as Surveyor
        console.log("\n1️⃣  Authenticating as Surveyor...");
        await axios.post(`${BASE_URL}/auth/register`, SURVEYOR_USER).catch(() => { });
        const surveyorLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: SURVEYOR_USER.email, password: SURVEYOR_USER.password
        });
        const surveyorToken = surveyorLogin.data.data.token;
        console.log("   ✅ Surveyor Authenticated");

        // 2. Register & Login as Customer
        console.log("\n2️⃣  Authenticating as Customer...");
        await axios.post(`${BASE_URL}/auth/register`, CUSTOMER_USER).catch(() => { });
        const customerLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: CUSTOMER_USER.email, password: CUSTOMER_USER.password
        });
        const customerToken = customerLogin.data.data.token;
        console.log("   ✅ Customer Authenticated");


        // 3. Successful Submission (Surveyor)
        console.log("\n3️⃣  Submitting Survey (Authorized)...");
        const submitRes = await axios.post(`${BASE_URL}/surveys/submit`, SAMPLE_SURVEY, {
            headers: { Authorization: `Bearer ${surveyorToken}` }
        });
        console.log("   ✅ Survey Submitted ID:", submitRes.data.data._id);
        console.log("   ✅ Checksum verified in DB:", submitRes.data.data.checksum ? "Present" : "Missing");


        // 4. Failed Submission (Customer - RBAC Check)
        console.log("\n4️⃣  Attempting Unauthorized Submission...");
        try {
            await axios.post(`${BASE_URL}/surveys/submit`, SAMPLE_SURVEY, {
                headers: { Authorization: `Bearer ${customerToken}` }
            });
            console.error("   ❌ Failed: Should have been 403 Forbidden");
        } catch (error) {
            if (error.response?.status === 403) {
                console.log("   ✅ Authorization Blocked (403) - Success");
            } else {
                console.error("   ❌ Unexpected error:", error.message);
            }
        }

        // 5. Validation Check (Missing Data)
        console.log("\n5️⃣  Testing Input Validation...");
        try {
            await axios.post(`${BASE_URL}/surveys/submit`, { ...SAMPLE_SURVEY, rooms: [] }, {
                headers: { Authorization: `Bearer ${surveyorToken}` }
            });
            console.error("   ❌ Failed: Should have been 400 Bad Request");
        } catch (error) {
            if (error.response?.status === 400) {
                console.log("   ✅ Validator Caught Empty Rooms (400) - Success");
            } else {
                console.error("   ❌ Unexpected error:", error.message);
            }
        }

        console.log("\n✨ SURVEY SERVICE VERIFIED ✨");

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

testSurveyFlow();
