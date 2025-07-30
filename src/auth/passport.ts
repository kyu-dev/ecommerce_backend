import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import prisma from "@/db/prismaClient";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("attention la variable d'environement n'est pas définie");
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  throw new Error(
    "La variable d'environnement GOOGLE_CLIENT_ID n'est pas définie."
  );
}

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "la variable d'environement GOOGLE_CLIENT_SECRET n'est pas d'éfinie"
  );
}

// Stratégie locale pour la connexion (email + mdp)

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", //on remplace la config de base username par email
    },
    async (email: string, password: string, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password)
          return done(null, false, { message: "Utilisateur non trouvé" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
          return done(null, false, { message: "Mot de passe incorrect" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Stratégie JWT pour protéger les routes
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.id },
        });
        if (user) return done(null, user);
        else return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Stratégie Google Oauth
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/authentication/google/callback",
    },
    async (_accessToken: string, _refreshToken: string, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { google_id: profile.id },
        });

        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        // on regarde si le tableau renvenyer par google existe et si il n'est pas vide sinon email = null

        if (!email) {
          return done(
            new Error("L'email est requis pour la connexion Google.")
          );
        }

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: email,
              name: profile.displayName,
              google_id: profile.id,
              cart: {
                create: {}, // crée un panier vide lié à cet user
              },
            },
          });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
