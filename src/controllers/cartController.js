import prisma from "../db/prismaClient.js";

export async function getCart(req, res, next) {
  const userId = parseInt(req.params.userId);
  try {
    const data = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        items: {
          // récupère les CartItem liés
          include: {
            product: true, // et pour chaque item, récupère aussi le produit lié
          },
        },
      },
    });

    if (!data) {
      return res
        .status(404)
        .json({
          message: "Panier non trouvé, l'utilisateur n'existe peut être pas ?",
        });
    }

    if (data.items.length === 0) {
      return res.status(200).json({ message: "Le panier est vide", data });
    }

    res.status(200).json({ message: "Récupération du panier", data });
  } catch (err) {
    next(err);
  }
}
