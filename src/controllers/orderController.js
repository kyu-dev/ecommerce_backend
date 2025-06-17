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
