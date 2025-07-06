import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  modifyProduct,
} from "../controllers/productControllers";
import { authenticateJWT } from "@/middleware/authHandler";
const router = express.Router();

router.post("/create", createProduct);
router.get("/get", authenticateJWT, getProducts);
router.put("/put/:id", modifyProduct);
router.delete("/delete/:id", deleteProduct);

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

export default router;
