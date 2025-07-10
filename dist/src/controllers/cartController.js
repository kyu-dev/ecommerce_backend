"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
exports.addItems = addItems;
exports.deleteItem = deleteItem;
exports.modifyProduct = modifyProduct;
exports.clearCart = clearCart;
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
/////////////////////////////////////////
// Controller pour récuperer le panier //
/////////////////////////////////////////
async function getCart(req, res, next) {
    const userId = parseInt(req.params.userId);
    try {
        const data = await prismaClient_1.default.cart.findUnique({
            where: { userId: userId },
            include: {
                items: {
                    // récupère les CartItem liés
                    include: {
                        product: true, // et pour chaque item, récupère aussi le produit lié
                    },
                },
            },
        });
        if (!data) {
            return res.status(404).json({
                message: "Panier non trouvé, l'utilisateur n'existe peut être pas ?",
            });
        }
        if (data.items.length === 0) {
            return res.status(200).json({ message: "Le panier est vide", data });
        }
        res.status(200).json({ message: "Récupération du panier", data });
    }
    catch (err) {
        next(err);
    }
}
////////////////////////////////////////////////
// Controller pour ajouter un item au panier //
///////////////////////////////////////////////
async function addItems(req, res, next) {
    const userId = parseInt(req.params.userId);
    const { productId, quantity } = req.body;
    try {
        const cart = await prismaClient_1.default.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            return res.status(404).json({ message: "panier introuvable." });
        }
        const product = await prismaClient_1.default.product.findUnique({
            where: { id: parseInt(productId) },
        });
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable." });
        }
        //variable poour regarder si le produit est déjà dans le panier
        const itemAlreadyInTheCart = await prismaClient_1.default.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: parseInt(productId),
            },
        });
        //variable pour stocké le total de quantité en ajoutant la quantité souhaité avec la, quantité du panier
        const totalQuantity = itemAlreadyInTheCart
            ? itemAlreadyInTheCart.quantity + quantity
            : quantity;
        if (totalQuantity > product.stock) {
            return res.status(400).json({
                message: `Stock insuffisant. Stock disponible : ${product.stock}, demandé : ${totalQuantity}`,
            });
        }
        let updatedItem;
        // si l'item est déjà dans le panier on increment sa quantiter
        if (itemAlreadyInTheCart) {
            updatedItem = await prismaClient_1.default.cartItem.update({
                where: { id: itemAlreadyInTheCart.id },
                data: { quantity: { increment: quantity } },
            });
        }
        else {
            updatedItem = await prismaClient_1.default.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: parseInt(productId),
                    quantity,
                },
            });
        }
        res.status(200).json({
            message: "Panier mis à jour",
            data: updatedItem,
        });
    }
    catch (err) {
        next(err);
    }
}
////////////////////////////////////////////////
// Controller pour supprimer un item du panier//
///////////////////////////////////////////////
async function deleteItem(req, res, next) {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);
    try {
        const cart = await prismaClient_1.default.cart.findUnique({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: "panier introuvable." });
        }
        const deletedItem = await prismaClient_1.default.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId,
            },
        });
        if (deletedItem.count === 0) {
            return res
                .status(404)
                .json({ message: "Item non trouvé dans le panier." });
        }
        res.status(200).json({ message: "Item supprimé du panier." });
    }
    catch (err) {
        next(err);
    }
}
////////////////////////////////////////////////////////
// Controller pour  modifié un produit dans le panier //
////////////////////////////////////////////////////////
async function modifyProduct(req, res, next) {
    const userId = parseInt(req.params.userId);
    const { productId, quantity } = req.body;
    try {
        const cart = await prismaClient_1.default.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            return res.status(404).json({ message: "Panier introuvable." });
        }
        const itemToModify = await prismaClient_1.default.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
            },
        });
        if (!itemToModify) {
            return res
                .status(404)
                .json({ message: "Produit non trouvé dans le panier." });
        }
        if (quantity === 0) {
            const deletedItem = await prismaClient_1.default.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                    productId,
                },
            });
            return res.status(200).json({
                message: "Produit supprimé car quantité = 0",
                deletedItem,
            });
        }
        const updatedItem = await prismaClient_1.default.cartItem.update({
            where: { id: itemToModify.id },
            data: { quantity },
        });
        return res
            .status(200)
            .json({ message: "Quantité du produit modifiée", updatedItem });
    }
    catch (err) {
        next(err);
    }
}
/////////////////////////////////////
// Controller pour clear le panier //
/////////////////////////////////////
async function clearCart(req, res, next) {
    const userId = parseInt(req.params.userId);
    try {
        const cart = await prismaClient_1.default.cart.findUnique({
            where: { userId: userId },
        });
        if (!cart) {
            return res.status(404).json({ message: "panier introuvable." });
        }
        const clear = await prismaClient_1.default.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });
        res.status(200).json({ message: "panier vidé", clear });
    }
    catch (err) {
        next(err);
    }
}
