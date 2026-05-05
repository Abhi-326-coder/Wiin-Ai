// Must run before other local imports read process.env (ESM evaluates all imports first).
import "dotenv/config";
import cors from 'cors';

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";

import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
)


const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res)=>{
    res.send("Hello World");
});


connectMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
