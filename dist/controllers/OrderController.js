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
exports.updateStock = exports.deleteOrder = exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = exports.createOrder = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const Store_1 = require("../models/Store");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer, products, deliveryMethod, address, storeId } = req.body;
    try {
        const totalPrice = products.reduce((total, item) => {
            return total + item.quantity * item.price;
        }, 0);
        const newOrder = new Order_1.Order(Object.assign(Object.assign({ customer,
            products,
            totalPrice, status: "pending", deliveryMethod }, (deliveryMethod === "home_delivery" && { address })), (deliveryMethod === "store_pickup" && { storeId })));
        const savedOrder = yield newOrder.save();
        for (const item of products) {
            yield (0, exports.updateStock)(item.product, item.quantity, deliveryMethod === "store_pickup" ? storeId : undefined);
        }
        res.status(201).json({
            success: true,
            message: "Pedido creado exitosamente.",
            order: savedOrder,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear el pedido.",
            error: error.message,
        });
    }
});
exports.createOrder = createOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.Order.find()
            .populate("customer", "name email")
            .populate("products.product", "name price");
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las órdenes",
            error: error.message,
        });
    }
});
exports.getAllOrders = getAllOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const order = yield Order_1.Order.findById(id)
            .populate("customer", "name email")
            .populate("products.product", "name price");
        if (!order) {
            res.status(404).json({
                success: false,
                message: "Orden no encontrada",
            });
            return;
        }
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la orden",
            error: error.message,
        });
    }
});
exports.getOrderById = getOrderById;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedOrder = yield Order_1.Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedOrder) {
            res.status(404).json({
                success: false,
                message: "Orden no encontrada",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Estado de la orden actualizado exitosamente",
            order: updatedOrder,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el estado de la orden",
            error: error.message,
        });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedOrder = yield Order_1.Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            res.status(404).json({
                success: false,
                message: "Orden no encontrada",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Orden eliminada exitosamente",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la orden",
            error: error.message,
        });
    }
});
exports.deleteOrder = deleteOrder;
const updateStock = (productId, quantity, storeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (storeId) {
            const store = yield Store_1.Store.findOneAndUpdate({ _id: storeId, "stock.product": productId }, { $inc: { "stock.$.quantity": -quantity } }, { new: true });
            if (!store) {
                throw new Error("El producto no existe en la tienda o el stock es insuficiente.");
            }
        }
        else {
            const product = yield Product_1.Product.findOneAndUpdate({ _id: productId, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }, { new: true });
            if (!product) {
                throw new Error("El producto no tiene stock suficiente.");
            }
        }
    }
    catch (error) {
        throw new Error(`Error al actualizar el stock: ${error.message}`);
    }
});
exports.updateStock = updateStock;
//# sourceMappingURL=OrderController.js.map