"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const passport_1 = __importDefault(require("passport"));
// Middleware pour protéger les routes avec JWT
const authenticateJWT = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json({ message: "Accès non autorisé" });
        }
        req.user = user; // On attache l'utilisateur à la requête
        next();
    })(req, res, next);
};
exports.authenticateJWT = authenticateJWT;
