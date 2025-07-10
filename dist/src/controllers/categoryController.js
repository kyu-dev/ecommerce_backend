"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.deleteCategory = deleteCategory;
exports.getAllCategories = getAllCategories;
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
// controller de creation de category
async function createCategory(req, res, next) {
    const { name } = req.body;
    try {
        const category = await prismaClient_1.default.category.create({
            data: { name: name },
        });
        res.status(201).json({
            message: "Produit créé avec succès",
            category,
        });
    }
    catch (err) {
        next(err);
    }
}
// controller pour delete une category
async function deleteCategory(req, res, next) {
    const id = parseInt(req.params.id); // Convertir l'ID en nombre
    try {
        const category = await prismaClient_1.default.category.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({
            message: "Catégorie supprimée avec succès",
            category,
        });
    }
    catch (err) {
        next(err);
    }
}
// controller pour afficher les category avec les produit associé
async function getAllCategories(req, res, next) {
    try {
        const categories = await prismaClient_1.default.category.findMany({
            include: {
                products: true, // Inclure les produits associés à chaque catégorie
            },
        });
        if (categories.length === 0) {
            return res.status(404).json({ message: "Aucune catégorie trouvée" });
        }
        res.status(200).json({
            message: "Catégories récupérées avec succès",
            data: categories,
        });
    }
    catch (err) {
        next(err);
    }
}
