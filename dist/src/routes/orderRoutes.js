"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authHandler_1 = require("../middleware/authHandler");
const router = express_1.default.Router();
router.post("/:userId", authHandler_1.authenticateJWT, orderController_1.createOrder);
router.get("/:userId", authHandler_1.authenticateJWT, orderController_1.getOrders);
router.post("/:userId/create-checkout-session", authHandler_1.authenticateJWT, orderController_1.createCheckoutSession);
/**
 * @swagger
 * /order/{userId}:
 *   post:
 *     summary: Créer une commande pour un utilisateur
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
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 2
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Panier vide ou inexistant
 *   get:
 *     summary: Récupérer les commandes d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Commandes récupérées
 */
exports.default = router;
