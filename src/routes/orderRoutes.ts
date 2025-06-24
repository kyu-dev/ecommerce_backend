import express from "express";
import { createOrder, getOrders } from "../controllers/orderController";
const router = express.Router();

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
router.post("/:userId", createOrder);
router.get("/:userId", getOrders);
export default router;
