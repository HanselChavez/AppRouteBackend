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
exports.deletePriceRange = exports.createOrUpdatePriceRange = exports.getPriceRanges = void 0;
const PriceRange_1 = require("../models/PriceRange");
const getPriceRanges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const priceRanges = yield PriceRange_1.PriceRange.find();
        res.status(200).json(priceRanges);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener los rangos de precios", error: error.message });
    }
});
exports.getPriceRanges = getPriceRanges;
const createOrUpdatePriceRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, minPrice, maxPrice } = req.body;
    try {
        if (id) {
            const updatedPriceRange = yield PriceRange_1.PriceRange.findByIdAndUpdate(id, { name, minPrice, maxPrice }, { new: true, runValidators: true });
            if (!updatedPriceRange) {
                res.status(404).json({ message: "Rango de precios no encontrado" });
                return;
            }
            res.status(200).json(updatedPriceRange);
        }
        else {
            const newPriceRange = new PriceRange_1.PriceRange({ name, minPrice, maxPrice });
            const savedPriceRange = yield newPriceRange.save();
            res.status(201).json(savedPriceRange);
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error al crear o actualizar el rango de precios", error: error.message });
    }
});
exports.createOrUpdatePriceRange = createOrUpdatePriceRange;
const deletePriceRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedPriceRange = yield PriceRange_1.PriceRange.findByIdAndDelete(id);
        if (!deletedPriceRange) {
            res.status(404).json({ message: "Rango de precios no encontrado" });
            return;
        }
        res.status(200).json({ message: "Rango de precios eliminado" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al eliminar el rango de precios", error: error.message });
    }
});
exports.deletePriceRange = deletePriceRange;
//# sourceMappingURL=PriceRangeController.js.map