// @ts-nocheck
import passport from "@/auth/passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import prisma from "@/db/prismaClient";
import { NextFunction, Response } from "express";
import { authenticateJWT } from "@/middleware/authHandler";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Fonction pour se connecter
export function login(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: info?.message || "Auth failed" });

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ message: "hmmm le bon chocoCookie", token });
  })(req, res, next);
}

// fonction pour créer un compte
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cart: {
          create: {}, // crée un panier vide lié à cet user
        },
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

//functions pour la connexion O2auth google
export function googleCallback(req, res) {
  const { token } = req.user;

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(
    (process.env.FRONTEND_URL || "http://localhost:4000") +
      "/auth/google-callback"
  );
}

export function googleFailure(req, res) {
  res.status(401).json({ message: "Google Authentication Failed" });
}

// Contrôleur pour la route /authentication/me
export function ping(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    // On retourne les infos principales de l'utilisateur
    const { id, email, name } = req.user;
    res.status(200).json({ id, email, name });
  } catch (err) {
    next(err);
  }
}
