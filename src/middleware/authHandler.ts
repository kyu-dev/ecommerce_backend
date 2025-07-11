import passport from "passport";
import { Request, Response, NextFunction } from "express";

// Middleware pour protéger les routes avec JWT
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error | null, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Accès non autorisé" });
      }
      req.user = user; // On attache l'utilisateur à la requête
      next();
    }
  )(req, res, next);
};
