"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error("Erreur attrapée :", err);
    res.status(err.status || 500).json({
        message: "Erreur serveur",
        error: err,
    });
}
