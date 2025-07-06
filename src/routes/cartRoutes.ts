import express from "express";
import {
  addItems,
  getCart,
  deleteItem,
  modifyProduct,
  clearCart,
} from "../controllers/cartController";

const router = express.Router();

router.get("/:userId", getCart as any);
router.post("/:userId", addItems as any);
router.delete("/:userId/item/:productId", deleteItem as any);
router.put("/:userId", modifyProduct as any);
router.delete("/:userId/clearCart", clearCart as any);

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

export default router;
