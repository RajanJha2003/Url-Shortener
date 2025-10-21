import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import urlRouter from "./routes/urlRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getUrl } from "./controllers/urlController.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

connectDB()

// CORS configuration
app.use(cors({
  origin: [
    "https://url-shortenerr-three.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",userRouter)
app.use("/api/urls",urlRouter)

// Root level redirect route for short URLs
app.get('/:shortId', getUrl);

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

