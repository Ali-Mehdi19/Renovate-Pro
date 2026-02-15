import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const CUSTOMER = {
    fullName: "Booking Customer",
    email: `booker_${Date.now()}@example.com`,
    password: "password123",
    role: "Customer"
};

const SURVEYOR = {
    fullName: "Field Surveyor",
    email: `field_${Date.now()}@example.com`,
    password: "password123",
    role: "Surveyor"
};

const ADMIN = {
    fullName: "System Admin",
    email: `admin_${Date.now()}@example.com`,
    password: "password123",
    role: "Admin"
};

async function testAppointmentFlow() {
    console.log("🚀 Starting Appointment Service Test...");

    try {
        // 1. Authenticate Users
        console.log("\n1️⃣  Authenticating Users...");
        const custToken = await getAuthToken(CUSTOMER);
        const survToken = await getAuthToken(SURVEYOR);
        const adminToken = await getAuthToken(ADMIN);

        // Get Surveyor ID for assignment
        const survProfile = await axios.get(`${BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${survToken}` } });
        const surveyorId = survProfile.data.data._id;
        console.log("   ✅ Users Authenticated");

        // 2. Book Appointment (Customer)
        console.log("\n2️⃣  Customer Booking Appointment...");
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const bookRes = await axios.post(`${BASE_URL}/appointments/book`, {
            date_time: tomorrow,
            address: "789 Renovation Blvd, Mumbai",
            geocode: { lat: 19.0760, lng: 72.8777 }
        }, {
            headers: { Authorization: `Bearer ${custToken}` }
        });
        const apptId = bookRes.data.data._id;
        console.log("   ✅ Appointment Booked ID:", apptId);

        // 3. Assign Surveyor (Admin)
        console.log("\n3️⃣  Admin Assigning Surveyor...");
        await axios.patch(`${BASE_URL}/appointments/${apptId}/assign`, {
            surveyorId: surveyorId
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log("   ✅ Surveyor Assigned");

        // 4. Verify Task List (Surveyor)
        console.log("\n4️⃣  Surveyor Checking Tasks...");
        const tasksRes = await axios.get(`${BASE_URL}/appointments/tasks`, {
            headers: { Authorization: `Bearer ${survToken}` }
        });
        const myTask = tasksRes.data.data.find(t => t._id === apptId);
        if (!myTask) throw new Error("Task not found in surveyor list");
        console.log("   ✅ Task found in Surveyor's list");

        // 5. Update Status (Surveyor)
        console.log("\n5️⃣  Surveyor Marking Completed...");
        await axios.patch(`${BASE_URL}/appointments/${apptId}/status`, {
            status: "Completed"
        }, {
            headers: { Authorization: `Bearer ${survToken}` }
        });
        console.log("   ✅ Status Updated to Completed");

        console.log("\n✨ APPOINTMENT SERVICE VERIFIED ✨");

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

async function getAuthToken(user) {
    await axios.post(`${BASE_URL}/auth/register`, user).catch(() => { });
    const res = await axios.post(`${BASE_URL}/auth/login`, { email: user.email, password: user.password });
    return res.data.data.token;
}

testAppointmentFlow();
