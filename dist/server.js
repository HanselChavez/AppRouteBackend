"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cors_2 = require("./config/cors");
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const ErrorHandler_1 = require("./shared/errors/ErrorHandler");
const AuthenticationError_1 = require("./shared/errors/AuthenticationError");
const pathRoutes_1 = __importDefault(require("./routes/pathRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const nodeRoutes_1 = __importDefault(require("./routes/nodeRoutes"));
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)(cors_2.corsConfig));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.CLAVE_PASSPORT,
    resave: false,
    saveUninitialized: true,
}));
app.use((0, morgan_1.default)("dev"));
//seedNodes() // Seed initial nodes data
app.use("/api/auth", authRoutes_1.default);
app.use("/api/path", pathRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/nodes", nodeRoutes_1.default);
app.get("/error", (req, res, next) => {
    const error = new AuthenticationError_1.AuthenticationError("You are not authorized to access this resource");
    next(error);
});
app.use(/.*/, (req, res) => {
    res.status(404).json({ error: "Not found" });
});
app.use(ErrorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=server.js.map