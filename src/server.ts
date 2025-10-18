import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./shared/errors/ErrorHandler";
import { AuthenticationError } from "./shared/errors/AuthenticationError";
import pathRoutes from "./routes/pathRoutes";
import userRoutes from "./routes/userRoutes";
import nodeRoutes from "./routes/nodeRoutes";
import session from "express-session";
dotenv.config();
connectDB();

const app = express();
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.CLAVE_PASSPORT,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(morgan("dev"));
//seedNodes() // Seed initial nodes data
app.use("/api/auth", authRoutes);
app.use("/rutas", pathRoutes);
app.use("/api/users", userRoutes);
app.use("/api/nodes", nodeRoutes);
app.get("/error", (req, res, next) => {
    const error = new AuthenticationError(
        "You are not authorized to access this resource"
    );
    next(error);
});
app.use(/.*/, (req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

export default app;
