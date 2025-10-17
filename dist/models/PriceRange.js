"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceRange = void 0;
const mongoose_1 = require("mongoose");
const PriceRangeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
}, { timestamps: true });
const PriceRange = (0, mongoose_1.model)("PriceRange", PriceRangeSchema);
exports.PriceRange = PriceRange;
//# sourceMappingURL=PriceRange.js.map