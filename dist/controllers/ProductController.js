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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterOptions = exports.filterProducts = exports.getProductsByCategory = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = exports.changeAvilability = void 0;
const Product_1 = require("../models/Product");
const Category_1 = require("../models/Category");
const PriceRange_1 = require("../models/PriceRange");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_1 = require("../config/aws");
const changeAvilability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const product = yield Product_1.Product.findByIdAndUpdate(id, { isActive }).select("-__v -materials -reviews -createdAt -updatedAt");
        if (!product) {
            res.status(404).json({
                message: "Producto no encontrado.",
            });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener los productos.",
            error: error.message,
        });
    }
});
exports.changeAvilability = changeAvilability;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.Product.find()
            .populate("category", "name description")
            .select("-__v -materials -reviews -createdAt").sort({ name: 1 });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener los productos.",
            error: error.message,
        });
    }
});
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield Product_1.Product.findById(id).populate("category", "name description").select("-__v -reviews -createdAt");
        if (!product) {
            res.status(404).json({
                message: "Producto no encontrado.",
            });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener el producto.",
            error: error.message,
        });
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(500).json({
                message: 'Error al subir las imágenes.',
                error: err.message,
            });
            return;
        }
        const { name, description, price, category, variations, specifications, materials, discount, isActive } = req.body;
        const images = Array.isArray(req.files)
            ? req.files.map((file) => file.location)
            : [];
        const existingCategory = yield Category_1.Category.findById(category);
        if (!existingCategory) {
            return res.status(404).json({
                message: 'La categoría proporcionada no existe.',
            });
        }
        const newProduct = new Product_1.Product({
            name,
            description,
            price,
            images,
            category,
            variations: variations || [],
            specifications: specifications || [],
            materials: materials || [],
            discount: discount || 0,
            isActive: isActive !== undefined ? isActive : true,
        });
        const savedProduct = yield newProduct.save();
        return res.status(201).json(savedProduct);
    }));
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("updateData", req.body);
        if (err) {
            return res.status(500).json({
                message: 'Error al subir las imágenes.',
                error: err.message,
            });
        }
        const images = Array.isArray(req.files)
            ? req.files.map((file) => file.location)
            : [];
        try {
            const updateData = req.body;
            if (updateData.category) {
                const existingCategory = yield Category_1.Category.findById(updateData.category);
                if (!existingCategory) {
                    return res.status(400).json({
                        message: "La categoría proporcionada no existe.",
                    });
                }
            }
            const productToUpdate = yield Product_1.Product.findById(id);
            if (!productToUpdate) {
                return res.status(404).json({
                    message: "Producto no encontrado.",
                });
            }
            const existingImages = updateData.existingImages ? updateData.existingImages : [];
            if (!Array.isArray(existingImages)) {
                return res.status(400).json({
                    message: "El formato de las imágenes existentes no es válido.",
                });
            }
            updateData.images = [...existingImages, ...images];
            delete updateData.existingImages;
            const updatedProduct = yield Product_1.Product.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            if (!updatedProduct) {
                return res.status(404).json({
                    message: "Producto no encontrado después de la actualización.",
                });
            }
            console.log("updateData", updateData);
            console.log(updatedProduct);
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error al actualizar el producto.",
                error: error.message,
            });
        }
    }));
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedProduct = yield Product_1.Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            res.status(404).json({
                message: "Producto no encontrado.",
            });
            return;
        }
        res.status(200).json(deletedProduct);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al eliminar el producto.",
            error: error.message,
        });
    }
});
exports.deleteProduct = deleteProduct;
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        if (categoryId === "all") {
            const allProducts = yield Product_1.Product.find()
                .populate("category", "name description")
                .select("-__v");
            res.status(200).json(allProducts);
            return;
        }
        const products = yield Product_1.Product.find({ category: categoryId }).populate("category", "name description");
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener productos por categoría.",
            error: error.message,
        });
    }
});
exports.getProductsByCategory = getProductsByCategory;
const filterProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { color, size, minPrice, maxPrice, category, search, page = 1, limit = 10, sortOrder = "price-asc", } = req.query;
    try {
        const filter = { isActive: true };
        if (category && category !== "all") {
            filter.category = category;
        }
        if (color) {
            const colors = Array.isArray(color) ? color : [color];
            filter["variations.color"] = { $in: colors };
        }
        if (size) {
            const sizes = Array.isArray(size) ? size : [size];
            filter["variations.size"] = { $in: sizes };
        }
        if (minPrice || maxPrice) {
            filter["variations.price"] = {};
            if (minPrice)
                filter["variations.price"].$gte = Number(minPrice);
            if (maxPrice)
                filter["variations.price"].$lte = Number(maxPrice);
        }
        if (search) {
            filter.name = { $regex: new RegExp(search, "i") };
        }
        const sortOptions = {
            "price-asc": { "variations.price": 1 },
            "price-desc": { "variations.price": -1 },
            "name-asc": { name: 1 },
            "name-desc": { name: -1 },
        };
        const sort = sortOptions[sortOrder] || { "variations.price": 1 };
        const skip = (Number(page) - 1) * Number(limit);
        const total = yield Product_1.Product.countDocuments(filter);
        const products = yield Product_1.Product.find(filter)
            .populate("category", "name description")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean();
        const cleanedProducts = products.map((product) => {
            const { __v, createdAt, reviews, materials, updatedAt } = product, cleanedProduct = __rest(product, ["__v", "createdAt", "reviews", "materials", "updatedAt"]);
            return cleanedProduct;
        });
        res.status(200).json({
            products: cleanedProducts,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al filtrar los productos",
            error: error.message,
        });
    }
});
exports.filterProducts = filterProducts;
const getFilterOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colors = yield Product_1.Product.distinct("variations.color");
        const sizes = yield Product_1.Product.distinct("variations.size");
        const priceRanges = yield PriceRange_1.PriceRange.find({}, "minPrice maxPrice");
        res.status(200).json({ colors, sizes, priceRanges });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener las opciones de filtro.",
            error: error.message,
        });
    }
});
exports.getFilterOptions = getFilterOptions;
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: "public-read",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
    }),
}).array("images");
//# sourceMappingURL=ProductController.js.map