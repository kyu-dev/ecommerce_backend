"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const authHandler_1 = require("../middleware/authHandler");
const router = express_1.default.Router();
router.get("/:userId", authHandler_1.authenticateJWT, cartController_1.getCart);
router.post("/:userId", authHandler_1.authenticateJWT, cartController_1.addItems);
router.delete("/:userId/item/:productId", authHandler_1.authenticateJWT, cartController_1.deleteItem);
router.put("/:userId", authHandler_1.authenticateJWT, cartController_1.modifyProduct);
router.delete("/:userId/clearCart", authHandler_1.authenticateJWT, cartController_1.clearCart);
/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Récupérer le panier d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Panier récupéré
 *   post:
 *     summary: Ajouter des articles au panier
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Article(s) ajouté(s)
 *   put:
 *     summary: Modifier un produit du panier
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Produit modifié
 *
 * /cart/{userId}/item/{productId}:
 *   delete:
 *     summary: Supprimer un article du panier
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Article supprimé
 *
 * /cart/{userId}/clearCart:
 *   delete:
 *     summary: Vider le panier
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Panier vidé
 */
exports.default = router;
