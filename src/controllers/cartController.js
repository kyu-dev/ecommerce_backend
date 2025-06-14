import prisma from "../db/prismaClient.js";

export async function getCart(req, res, next) {
  const userId = req.params.userId;
  try {
    const data = await prisma.cart.findUnique({
      where: {
        userId: parseInt(userId),
      },
    });
    if (!data) {
      res.status(200).json({ message: "panié vide" });
    } else {
      res.status(200).json({ message: "Récupération du panié", data });
    }
  } catch (err) {
    next(err);
  }
}

export async function addItems(req, res, next) {
  const userId = req.params.userId;
}
