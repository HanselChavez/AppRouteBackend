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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.getCart = exports.addToCart = exports.getCartByIdUser = exports.updateCartByIdUser = void 0;
const Cart_1 = require("../models/Cart");
const Product_1 = require("../models/Product");
const updateCartByIdUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { cart } = req.body;
        if (!Array.isArray(cart)) {
            res.status(400).json({ message: "El carrito debe ser un array de productos." });
            return;
        }
        for (let item of cart) {
            if (!item.product || !item.product._id || !item.quantity) {
                res.status(400).json({ message: "Cada producto debe tener un `product` (ID) y `quantity`." });
                return;
            }
        }
        const updatedCart = yield Promise.all(cart.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield Product_1.Product.findById(item.product._id).lean();
            const { __v, createdAt, reviews, materials, updatedAt } = product, cleanedProduct = __rest(product, ["__v", "createdAt", "reviews", "materials", "updatedAt"]);
            if (!cleanedProduct) {
                throw new Error(`Producto no encontrado con el ID: ${item.product._id}`);
            }
            return Object.assign(Object.assign({}, item), { product: cleanedProduct });
        })));
        let existingCart = yield Cart_1.Cart.findOne({ user: userId });
        if (!existingCart) {
            existingCart = new Cart_1.Cart({ user: userId, items: updatedCart, totalPrice: 0 });
        }
        else {
            existingCart.items = updatedCart;
        }
        yield existingCart.save();
        res.status(200).json({ message: "Carrito actualizado correctamente", cart: existingCart });
    }
    catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ message: "Error al actualizar el carrito", error });
    }
});
exports.updateCartByIdUser = updateCartByIdUser;
const getCartByIdUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const cart = yield Cart_1.Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            res.status(404).json({ message: "Carrito no encontrado" });
            return;
        }
        const sanitizedCartItems = cart.items.map((item) => {
            return {
                _id: item._id,
                quantity: item.quantity,
                selectedVariation: {
                    color: item.selectedVariation.color,
                    size: item.selectedVariation.size,
                    price: item.selectedVariation.price,
                    _id: item.selectedVariation._id,
                },
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    description: item.product.description,
                    images: item.product.images,
                    isActive: item.product.isActive,
                },
            };
        });
        res.status(200).json(sanitizedCartItems);
    }
    catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ message: "Error al obtener el carrito", error });
    }
});
exports.getCartByIdUser = getCartByIdUser;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const { productId, variation, quantity } = req.body;
    try {
        const product = yield Product_1.Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Producto no encontrado." });
            return;
        }
        const selectedVariation = product.variations.find((v) => v.color === variation.color && v.size === variation.size);
        if (!selectedVariation) {
            res.status(400).json({ message: "Variación no válida." });
            return;
        }
        if (selectedVariation.maxItemsPerUser &&
            quantity > selectedVariation.maxItemsPerUser) {
            res.status(400).json({
                message: `Solo puedes comprar hasta ${selectedVariation.maxItemsPerUser} unidades de este producto.`,
            });
            return;
        }
        if (selectedVariation.stock < quantity) {
            res.status(400).json({
                message: `Solo quedan ${selectedVariation.stock} en stock para esta variación.`,
            });
            return;
        }
        let cart = yield Cart_1.Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart_1.Cart({ user: userId, items: [] });
        }
        const existingItem = cart.items.find((item) => item.product.toString() === productId &&
            item.selectedVariation.color === variation.color &&
            item.selectedVariation.size === variation.size);
        if (existingItem) {
            existingItem.quantity += quantity;
            if (existingItem.quantity > selectedVariation.stock) {
                res.status(400).json({
                    message: `Stock insuficiente. Solo puedes agregar ${selectedVariation.stock - existingItem.quantity + quantity}.`,
                });
                return;
            }
        }
        else {
            cart.items.push({ product: productId, selectedVariation, quantity });
        }
        yield cart.save();
        res.status(200).json({ message: "Producto añadido al carrito.", cart });
    }
    catch (error) {
        res.status(500).json({ message: "Error interno del servidor.", error });
    }
});
exports.addToCart = addToCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    try {
        const cart = yield Cart_1.Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            res.status(404).json({ message: "Carrito no encontrado." });
            return;
        }
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: "Error interno del servidor.", error });
    }
});
exports.getCart = getCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const { productId, variation } = req.body;
    try {
        const cart = yield Cart_1.Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: "Carrito no encontrado." });
            return;
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId ||
            item.selectedVariation.color !== variation.color ||
            item.selectedVariation.size !== variation.size);
        yield cart.save();
        res.status(200).json({ message: "Producto eliminado del carrito.", cart });
    }
    catch (error) {
        res.status(500).json({ message: "Error interno del servidor.", error });
    }
});
exports.removeFromCart = removeFromCart;
//# sourceMappingURL=CartController.js.map