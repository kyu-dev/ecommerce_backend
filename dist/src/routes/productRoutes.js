"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productControllers_1 = require("../controllers/productControllers");
const authHandler_1 = require("../middleware/authHandler");
const router = express_1.default.Router();
router.post("/create", authHandler_1.authenticateJWT, productControllers_1.createProduct);
router.get("/get", productControllers_1.getProducts);
router.get("/new/:limit", productControllers_1.getNewProducts);
router.get("/top/:limit", productControllers_1.getTopProduct);
router.put("/put/:id", authHandler_1.authenticateJWT, productControllers_1.modifyProduct);
router.delete("/delete/:id", authHandler_1.authenticateJWT, productControllers_1.deleteProduct);
/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Créer un produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "T-shirt"
 *               price:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Produit créé
 *
 * /product/get:
 *   get:
 *     summary: Récupérer tous les produits
 *     responses:
 *       200:
 *         description: Liste des produits
 *
 * /product/put/{id}:
 *   put:
 *     summary: Modifier un produit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "T-shirt modifié"
 *               price:
 *                 type: number
 *                 example: 24.99
 *               stock:
 *                 type: integer
 *                 example: 80
 *     responses:
 *       200:
 *         description: Produit modifié
 *
 * /product/delete/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit supprimé
 */
exports.default = router;
