import prisma from "../db/prismaClient";
import { Request, Response, NextFunction } from "express";

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.userId);
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Panier vide ou inexistant." });
    }

    // Vérification du stock
    for (const item of cart.items) {
      const actualStock = item.product.stock;
      if (item.quantity > actualStock) {
        return res.status(400).json({
          message: `Stock insuffisant pour le produit "${item.product.name}". Stock actuel : ${actualStock}, demandé : ${item.quantity}.`,
        });
      }
    }

    interface OrderItem {
      productId: number;
      quantity: number;
      product: {
        price: number;
      };
    }
    // Calcul du total
    const total = cart.items.reduce(
      (acc: number, item: OrderItem) =>
        acc + item.quantity * item.product.price,
      0
    );

    // Création de la commande

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        orderItems: {
          create: cart.items.map((item: OrderItem) => ({
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

    // Mise à jour du stock des produits
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

    // Suppression des items du panier
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.status(201).json({
      message: "Commande créée avec succès.",
      order,
      total,
    });
  } catch (err) {
    next(err);
  }
}
export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.userId);
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
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
