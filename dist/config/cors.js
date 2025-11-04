"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
exports.corsConfig = {
    origin: function (origin, callback) {
        const whitelist = [
            process.env.FRONTEND_URL,
            process.env.FRONTEND_URL2,
            "exp://192.168.1.8:8081",
            "http://localhost:8081",
        ];
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Error de CORS"));
        }
    },
};
//# sourceMappingURL=cors.js.map