import express from "express";
import { createOrder, getOrders } from "../controllers/orderController";
const router = express.Router();

router.post("/:userId", createOrder as any);
router.get("/:userId", getOrders);
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
export default router;
