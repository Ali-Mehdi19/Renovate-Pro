import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/auth';
const TEST_USER = {
    fullName: "Test User",
    email: `test_${Date.now()}@example.com`,
    password: "password123",
    role: "Customer"
};

async function testAuthFlow() {
    console.log("🚀 Starting Authentication Flow Test...");

    try {
        // 1. Register
        console.log(`\n1️⃣  Registering User (${TEST_USER.email})...`);
        const registerRes = await axios.post(`${BASE_URL}/register`, TEST_USER);
        console.log("   ✅ Registration Successful:", registerRes.data.message);

        // 2. Login
        console.log("\n2️⃣  Logging In...");
        const loginRes = await axios.post(`${BASE_URL}/login`, {
            email: TEST_USER.email,
            password: TEST_USER.password
        });

        const token = loginRes.data.data.token;
        if (!token) throw new Error("No token received!");
        console.log("   ✅ Login Successful! Token received.");

        // 3. Get Profile
        console.log("\n3️⃣  Fetching User Profile...");
        const profileRes = await axios.get(`${BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("   ✅ Profile Fetched:", profileRes.data.data.fullName);

        // 4. Update Profile
        console.log("\n4️⃣  Updating Profile...");
        const updateRes = await axios.patch(`${BASE_URL}/update-account`, {
            fullName: "Updated Test User"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("   ✅ Profile Updated:", updateRes.data.data.fullName);

        // 5. Verify Unauthorized Access
        console.log("\n5️⃣  Verifying Unauthorized Access...");
        try {
            await axios.get(`${BASE_URL}/me`);
            console.error("   ❌ Failed: Should have returned 401");
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("   ✅ Correctly blocked unauthorized request (401)");
            } else {
                console.error("   ❌ Unexpected error:", error.message);
            }
        }

        console.log("\n✨ AUTHENTICATION FLOW VERIFIED ✨");

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

testAuthFlow();
