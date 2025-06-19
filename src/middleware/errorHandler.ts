// middleware d'erreur handleling (capture toute les erreur passé à next)
// note à moi même: meme si valeur is never read, enlève pas req et next, c'est important pour le midleware d'erreur :)
import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Erreur attrapée :", err);

  res.status(err.status || 500).json({
    message: "Erreur serveur",
    error: err,
  });
}
