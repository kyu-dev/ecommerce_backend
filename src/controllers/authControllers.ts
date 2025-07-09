// @ts-nocheck
import passport from "../auth/passport.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import prisma from "../db/prismaClient.ts";

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

    res.cookie("chocoCookie", token, {
      httpOnly: true, // le cookie n'est pas accessible en JS côté client
      maxAge: 3600000, // 1h en ms
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
    maxAge: 60 * 60 * 1000,
  });

  res.redirect("http://localhost:4000/auth/google-callback");
}

export function googleFailure(req, res) {
  res.status(401).json({ message: "Google Authentication Failed" });
}
