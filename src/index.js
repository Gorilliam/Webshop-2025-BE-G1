import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import testRouter from "./routes/test.js";
import apiDocumentation from "./routes/documentation.js";
import categoryRoutes from "./routes/categories.js";
import { mustBeDeveloper } from "./middleware/test.js";
import { userContextMiddleware } from "./middleware/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hakim-livs";

// Middleware
app.use(cors("*"));
app.use(express.json());
app.use(cookieParser());
app.use(userContextMiddleware)

// logger
app.use(async (req, res, next) => {
  console.log(`\n\n--- New request ---`)
  console.log(`${req.method} @ ${req.url}`);
  console.log("BODY:", req.body);
  console.log("Has token:", req.cookies['hakim-livs-token'] !== undefined)
  console.log("USER:", req.user)

  res.on('finish', () => {
    console.log(`- END of ${req.method}${req.url} -`)
  })

  next();
});

// API Documentation route
app.get("/api", apiDocumentation);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/test", mustBeDeveloper, testRouter);

async function start() {
  try {
    const conn = await mongoose.connect(MONGODB_URI)
    console.log(`Connected successfully.`)
    await conn.syncIndexes() // So that indexes are automatically dropped if a schema changes.
    console.log(`Schemas synchronized.`)
  } catch (error) {
    console.log(`Failed connecting`)
    console.log(error)
  }

  app.listen(PORT, () => {
    console.log(`Server running. http://localhost:${PORT}`)
  })
}

start()

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     console.log(`Connected, `, MONGODB_URI)
//   })
//   .catch((err) => {
//     console.log("Failed connecting to MONGO")
//     console.log(err)
//   })
  
// app.listen(PORT,() => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`http://localhost:${PORT}`)
// });

// 