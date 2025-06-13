// middleware d'erreur handleling (capture toute les erreur passé à next)
export function errorHandler(err, req, res, next) {
  console.error("Erreur attrapée :", err);

  res.status(err.status || 500).json({
    message: "Erreur serveur",
    error: err,
  });
}
