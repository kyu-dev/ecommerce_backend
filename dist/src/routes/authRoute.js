"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const authHandler_1 = require("../middleware/authHandler");
// route de connexion et création de compte local strategie
router.post("/login", authControllers_1.login);
router.post("/register", authControllers_1.register);
//
// route O2auth Google
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
}), authControllers_1.googleCallback);
router.get("/failure", authControllers_1.googleFailure);
//
router.get("/me", authHandler_1.authenticateJWT, authControllers_1.ping);
/**
 * @swagger
 * /authentication/login:
 *   post:
 *     summary: Connexion utilisateur (local)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@email.com"
 *               password:
 *                 type: string
 *                 example: "motdepasse"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Authentification échouée
 *
 * /authentication/register:
 *   post:
 *     summary: Inscription utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@email.com"
 *               password:
 *                 type: string
 *                 example: "motdepasse"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: Utilisateur inscrit
 *
 * /authentication/google:
 *   get:
 *     summary: Connexion via Google OAuth
 *     responses:
 *       302:
 *         description: Redirection vers Google
 *
 * /authentication/google/callback:
 *   get:
 *     summary: Callback Google OAuth
 *     responses:
 *       200:
 *         description: Connexion Google réussie
 *       401:
 *         description: Authentification Google échouée
 *
 * /authentication/failure:
 *   get:
 *     summary: Échec de l'authentification Google
 *     responses:
 *       401:
 *         description: Échec Google
 */
exports.default = router;
