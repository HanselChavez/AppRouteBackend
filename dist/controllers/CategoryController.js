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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategoriesWithProducts = exports.getTopCategories = exports.getAllCategories = void 0;
const Category_1 = require("../models/Category");
const Product_1 = require("../models/Product");
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.Category.find()
            .populate("name description")
            .lean();
        for (let category of categories) {
            const productCount = yield Product_1.Product.countDocuments({ category: category._id });
            category.productCount = productCount;
        }
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener las categorías.",
            error: error.message,
        });
    }
});
exports.getAllCategories = getAllCategories;
const getTopCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topCategories = yield Product_1.Product.aggregate([
            { $group: { _id: "$category", productCount: { $sum: 1 } } },
            { $sort: { productCount: -1 } },
            { $limit: 4 },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            { $unwind: "$categoryDetails" },
            {
                $project: {
                    _id: 0,
                    categoryId: "$_id",
                    name: "$categoryDetails.name",
                    description: "$categoryDetails.description",
                    productCount: 1,
                    image: "$categoryDetails.image",
                },
            },
        ]);
        res.status(200).json(topCategories);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener las categorías destacadas.",
            error: error.message,
        });
    }
});
exports.getTopCategories = getTopCategories;
const getCategoriesWithProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoriesWithProducts = yield Category_1.Category.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "category",
                    as: "products",
                },
            },
            {
                $match: {
                    "products.0": { $exists: true },
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    parent: 1,
                    productCount: { $size: "$products" },
                },
            },
        ]);
        res.status(200).json(categoriesWithProducts);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener las categorías con productos.",
            error: error.message,
        });
    }
});
exports.getCategoriesWithProducts = getCategoriesWithProducts;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield Category_1.Category.findById(id).populate("parent", "name description");
        if (!category) {
            res.status(404).json({
                message: "Categoría no encontrada.",
            });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener la categoría.",
            error: error.message,
        });
    }
});
exports.getCategoryById = getCategoryById;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, parent } = req.body;
    try {
        if (parent) {
            const parentCategory = yield Category_1.Category.findById(parent);
            if (!parentCategory) {
                res.status(400).json({
                    message: "La categoría padre proporcionada no existe.",
                });
                return;
            }
        }
        const newCategory = new Category_1.Category({ name, description, parent });
        const savedCategory = yield newCategory.save();
        res.status(201).json(savedCategory);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al crear la categoría.",
            error: error.message,
        });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    console.log(updateData);
    try {
        if (updateData.parent) {
            const parentCategory = yield Category_1.Category.findById(updateData.parent);
            if (!parentCategory) {
                res.status(400).json({
                    message: "La categoría padre proporcionada no existe.",
                });
                return;
            }
        }
        const updatedCategory = yield Category_1.Category.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedCategory) {
            res.status(404).json({
                message: "Categoría no encontrada.",
            });
            return;
        }
        updatedCategory.save();
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al actualizar la categoría.",
            error: error.message,
        });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const productsInCategory = yield Product_1.Product.countDocuments({ category: id });
        if (productsInCategory > 0) {
            res.status(400).json({
                message: "No se puede eliminar la categoría porque tiene productos asociados.",
            });
            return;
        }
        const deletedCategory = yield Category_1.Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            res.status(404).json({
                message: "Categoría no encontrada.",
            });
            return;
        }
        res.status(200).json({
            message: "Categoría eliminada exitosamente.",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al eliminar la categoría.",
            error: error.message,
        });
    }
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=CategoryController.js.map