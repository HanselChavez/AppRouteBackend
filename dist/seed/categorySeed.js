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
const Category_1 = require("../models/Category");
const seedCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = [
        {
            name: 'Muebles',
            description: 'Muebles para todos los gustos y estilos.',
        },
        {
            name: 'Camas',
            description: 'Camas cómodas para un descanso de calidad.',
        },
        {
            name: 'Colchones',
            description: 'Colchones de alta calidad para un buen sueño.',
        },
        {
            name: 'Sillas y Sofás',
            description: 'Sillas, sofás y muebles de asiento para tu hogar.',
        },
        {
            name: 'Mesas',
            description: 'Mesas de comedor y escritorios.',
        },
        {
            name: 'Decoración',
            description: 'Accesorios decorativos para tu hogar.',
        },
        {
            name: 'Armarios',
            description: 'Armarios y muebles de almacenamiento.',
        },
        {
            name: 'Oficina',
            description: 'Muebles y accesorios para tu oficina.',
        },
    ];
    try {
        yield Category_1.Category.deleteMany();
        yield Category_1.Category.insertMany(categories);
        console.log('Categorías insertadas correctamente');
    }
    catch (error) {
        console.error('Error insertando categorías:', error);
    }
});
exports.default = seedCategory;
//# sourceMappingURL=categorySeed.js.map