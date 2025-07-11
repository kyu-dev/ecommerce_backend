import express from "express";
import {
  login,
  register,
  googleCallback,
  googleFailure,
  ping,
  logout,
} from "../controllers/authControllers";
const router = express.Router();
import passport from "passport";
import { authenticateJWT } from "@/middleware/authHandler";

// route de connexion et création de compte local strategie
router.post("/login", login);
router.post("/register", register);
//

// route O2auth Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  googleCallback
);
router.get("/failure", googleFailure);
//

router.get("/me", authenticateJWT, ping as any);
router.post("/logout", logout);

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

export default router;
