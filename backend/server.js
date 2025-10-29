require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const checkoutRouter = require("./routes/checkout");
const { errorHandler } = require("./utils/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());


app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.get("/api/health", (req, res) => res.json({ ok: true, time: Date.now() }));


app.use(errorHandler);

let server;

// ✅ Start the server
async function start() {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();

// ✅ Graceful shutdown
async function gracefulShutdown(signal) {
  try {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
      console.log("HTTP server closed.");
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error during graceful shutdown", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection at:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  process.exit(1);
});
