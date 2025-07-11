import passport from "passport";
import { Request, Response, NextFunction } from "express";

// Middleware pour protéger les routes avec JWT
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('🔐 Debug authenticateJWT - cookies:', req.cookies);
  console.log('🔐 Debug authenticateJWT - token dans cookie:', req.cookies?.token);
  
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error | null, user: any, info: any) => {
      console.log('🔐 Debug passport JWT - err:', err);
      console.log('🔐 Debug passport JWT - user:', user);
      console.log('🔐 Debug passport JWT - info:', info);
      
      if (err) return next(err);
      if (!user) {
        console.log('❌ JWT: Pas d\'utilisateur trouvé');
        return res.status(401).json({ message: "Accès non autorisé" });
      }
      console.log('✅ JWT: Utilisateur authentifié:', user.id);
      req.user = user; // On attache l'utilisateur à la requête
      next();
    }
  )(req, res, next);
};
