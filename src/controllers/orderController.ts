import prisma from "../db/prismaClient";
import { Request, Response, NextFunction } from "express";
import stripe from "../utils/stripe";

// Fonction utilitaire pour créer une commande à partir du panier utilisateur
async function createOrderForUser(userId: number) {
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
    throw new Error("Panier vide ou inexistant.");
  }

  // Vérification du stock
  for (const item of cart.items) {
    const actualStock = item.product.stock;
    if (item.quantity > actualStock) {
      throw new Error(
        `Stock insuffisant pour le produit "${item.product.name}". Stock actuel : ${actualStock}, demandé : ${item.quantity}.`
      );
    }
  }

  // Calcul du total
  const total = cart.items.reduce(
    (acc: number, item: any) => acc + item.quantity * item.product.price,
    0
  );

  // Création de la commande
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "paid", // La commande est directement en statut payé
      orderItems: {
        create: cart.items.map((item: any) => ({
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

  return order;
}

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.userId);
  try {
    const order = await createOrderForUser(userId);
    res.status(201).json({
      message: "Commande créée avec succès.",
      order,
      total: order.total,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
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

export const createCheckoutSession = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  try {
    // Récupérer le panier de l'utilisateur avec les produits
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

    // Transformer les items du panier au format Stripe
    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.product.price * 100), // Stripe attend des centimes
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url:
        (process.env.FRONTEND_URL || "http://localhost:4000") + "/success",
      cancel_url: process.env.FRONTEND_URL || "http://localhost:4000",
      metadata: { userId: userId.toString() }, // Ajout du userId pour le webhook
    });
    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Erreur signature Stripe:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log("Événement Stripe reçu:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Session Stripe:", session);
    const userId = session.metadata?.userId;
    console.log("userId reçu dans le webhook:", userId);
    if (userId) {
      try {
        await createOrderForUser(parseInt(userId));
        console.log("Commande créée pour userId:", userId);
      } catch (err: any) {
        console.error("Erreur création commande via webhook:", err);
      }
    }
  }

  res.send();
};
