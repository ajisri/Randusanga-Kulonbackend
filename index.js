import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import loginRoute from "./routes/loginRoute.js";
import profileRoute from "./routes/profileRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import transparentRoute from "./routes/transparentRoute.js";
import socialRoute from "./routes/socialRoute.js";

// Load environment variables
dotenv.config();

// Log DATABASE_URL for debugging
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const app = express();
const prisma = new PrismaClient();

// Middleware setup
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Routes
app.use(loginRoute);
app.use(profileRoute);
app.use(serviceRoute);
app.use(transparentRoute);
app.use(socialRoute);

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

// Test endpoint for database URL
app.get("/test-database-url", (req, res) => {
  res.json({ DATABASE_URL: process.env.DATABASE_URL });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Invoke the database connection test
testDatabaseConnection();
