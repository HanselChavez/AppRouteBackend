"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PriceRange_1 = require("../models/PriceRange");
const priceRangesData = [
    { name: "0 - 100", minPrice: 0, maxPrice: 100 },
    { name: "101 - 500", minPrice: 101, maxPrice: 500 },
    { name: "501 - 1000", minPrice: 501, maxPrice: 1000 },
    { name: "1001 - 5000", minPrice: 1001, maxPrice: 5000 },
    { name: "5001 - 10000", minPrice: 5001, maxPrice: 10000 },
];
const seedPriceRange = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield PriceRange_1.PriceRange.deleteMany();
        yield PriceRange_1.PriceRange.insertMany(priceRangesData);
        console.log('Price ranges insertadas correctamente');
    }
    catch (error) {
        console.error('Error insertando categorías:', error);
    }
});
exports.default = seedPriceRange;
//# sourceMappingURL=priceRangeSeed.js.map