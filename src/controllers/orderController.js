import prisma from "../db/prismaClient.js";

export async function createOrder(req, res, next) {
  const userId = parseInt(req.params.userId);
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    for (const item of cart.items) {
      const actualStock = item.product.stock;
      if (item.quantity > actualStock) {
        return res.status(400).json({
          message: `Stock insuffisant pour le produit "${item.product.name}". Stock actuel : ${actualStock}, demandé : ${item.quantity}.`,
        });
      }
    }
    const order = prisma.order.create({
      data: {
        userId,
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    //réduire le stock du produit à la commande
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }
    //CALCULE du total de la comande
    const total = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );

    res.status(201).json({
      message: "Commande créée avec succès.",
      order,
      total,
    });
  } catch (err) {
    next(err);
  }
}
export async function getOrders(req, res, next) {
  const userId = parseInt(req.params.userId);
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      message: "commandes récupéré",
      orders,
    });
  } catch (err) {
    next(err);
  }
}
