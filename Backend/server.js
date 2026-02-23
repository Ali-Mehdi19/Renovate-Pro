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
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// CORS setup
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Allow both localhost and 127.0.0.1
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Global Error Handler
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/planners", plannerRoutes);
app.use("/api/blueprints", blueprintRoutes);
app.use("/api/appointments", appointmentRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
