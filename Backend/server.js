import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import connectDB from "./database/DB.config.js";
import authRoutes from "./route/user.route.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// CORS setup
app.use(cors({
  origin: "http://localhost:3000", // Allow only frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["t-Type", "Authorization"]
}));

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
