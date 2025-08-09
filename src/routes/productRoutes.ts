import express from "express";
import {
  createProduct,
  createManyProducts,
  deleteProduct,
  getNewProducts,
  getProducts,
  getTopProduct,
  modifyProduct,
} from "../controllers/productControllers";
import { authenticateJWT } from "@/middleware/authHandler";
const router = express.Router();

router.post("/create", authenticateJWT, createProduct);
router.post("/create-many", authenticateJWT, createManyProducts);
/**
 * @swagger
 * /product/create-many:
 *   post:
 *     summary: Créer plusieurs produits d'un coup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Produit 1"
 *                     price:
 *                       type: number
 *                       example: 10.99
 *                     stock:
 *                       type: integer
 *                       example: 100
 *                     description:
 *                       type: string
 *                       example: "Description du produit 1"
 *                     alcoholDegree:
 *                       type: number
 *                       example: 12.5
 *                     img:
 *                       type: string
 *                       example: "url_image_1.jpg"
 *                     categoryId:
 *                       type: integer
 *                       example: 1
 *                     rating:
 *                       type: number
 *                       example: 4.5
 *                     volumeId:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Produits créés
 */
router.get("/get", getProducts as any);
router.get("/new/:limit", getNewProducts);
router.get("/top/:limit", getTopProduct);
router.put("/put/:id", authenticateJWT, modifyProduct);
router.delete("/delete/:id", authenticateJWT, deleteProduct);

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
