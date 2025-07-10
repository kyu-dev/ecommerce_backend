"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("attention la variable d'environement n'est pas définie");
}
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
    throw new Error("La variable d'environnement GOOGLE_CLIENT_ID n'est pas définie.");
}
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_SECRET) {
    throw new Error("la variable d'environement GOOGLE_CLIENT_SECRET n'est pas d'éfinie");
}
// Stratégie locale pour la connexion (email + mdp)
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email", //on remplace la config de base username par email
}, async (email, password, done) => {
    try {
        const user = await prismaClient_1.default.user.findUnique({ where: { email } });
        if (!user || !user.password)
            return done(null, false, { message: "Utilisateur non trouvé" });
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch)
            return done(null, false, { message: "Mot de passe incorrect" });
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
// Stratégie JWT pour protéger les routes
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: (req) => {
        if (req && req.cookies) {
            return req.cookies.token;
        }
        return null;
    },
    secretOrKey: JWT_SECRET,
}, async (jwtPayload, done) => {
    try {
        const user = await prismaClient_1.default.user.findUnique({
            where: { id: jwtPayload.id },
        });
        if (user)
            return done(null, user);
        else
            return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}));
// Stratégie Google Oauth
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/authentication/google/callback",
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        let user = await prismaClient_1.default.user.findUnique({
            where: { google_id: profile.id },
        });
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        // on regarde si le tableau renvenyer par google existe et si il n'est pas vide sinon email = null
        if (!email) {
            return done(new Error("L'email est requis pour la connexion Google."));
        }
        if (!user) {
            user = await prismaClient_1.default.user.create({
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
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: "24h",
        });
        return done(null, { user, token });
    }
    catch (error) {
        done(error);
    }
}));
exports.default = passport_1.default;
