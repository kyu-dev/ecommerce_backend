import prisma from "../db/prismaClient.js";

export async function getCart(req, res, next) {
  const userId = req.params.userId;
  try {
    const data = await prisma.cart.findUnique({
      where: {
        userId: parseInt(userId),
      },
    });
    res.status(200).json({ message: "Récupération du panié", data });
  } catch (err) {
    next(err);
  }
}
