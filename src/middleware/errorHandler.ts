// @ts-nocheck 

export function errorHandler(res, err) {
    console.error('💥 Erreur attrapée :', err)

    res.status(500).json({
        message: 'Erreur serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
}