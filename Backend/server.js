import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/DB.config.js";
import authRoutes from "./routes/user.route.js";
import surveyRoutes from "./routes/survey.route.js";
import plannerRoutes from "./routes/planner.route.js";
import blueprintRoutes from "./routes/blueprint.route.js";
import appointmentRoutes from "./routes/appointment.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// CORS setup
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL,  // Render deployed frontend URL
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Health check endpoint (Render pings this to verify the service is alive)
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Renovate-Pro API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/planners", plannerRoutes);
app.use("/api/blueprints", blueprintRoutes);
app.use("/api/appointments", appointmentRoutes);

// Global Error Handler (must be after routes)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Wait for DB to connect BEFORE starting the server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
};

startServer();
