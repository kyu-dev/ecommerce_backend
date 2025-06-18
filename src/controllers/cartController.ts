import prisma from "../db/prismaClient";
import type { Request, Response, NextFunction } from "express";

/////////////////////////////////////////
// Controller pour récuperer le panier //
/////////////////////////////////////////
export async function getCart(req: Request, res: Response, next: NextFunction) {
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
      return res.status(404).json({
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

////////////////////////////////////////////////
// Controller pour ajouter un item au panier //
///////////////////////////////////////////////
export async function addItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.userId);
  const { productId, quantity } = req.body;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: "panier introuvable." });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ message: "Produit introuvable." });
    }

    //variable poour regarder si le produit est déjà dans le panier
    const itemAlreadyInTheCart = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: parseInt(productId),
      },
    });

    //variable pour stocké le total de quantité en ajoutant la quantité souhaité avec la, quantité du panier
    const totalQuantity: number = itemAlreadyInTheCart
      ? itemAlreadyInTheCart.quantity + quantity
      : quantity;

    if (totalQuantity > product.stock) {
      return res.status(400).json({
        message: `Stock insuffisant. Stock disponible : ${product.stock}, demandé : ${totalQuantity}`,
      });
    }

    let updatedItem: {
      id: number;
      cartId: number;
      productId: number;
      quantity: number;
    };
    // si l'item est déjà dans le panier on increment sa quantiter
    if (itemAlreadyInTheCart) {
      updatedItem = await prisma.cartItem.update({
        where: { id: itemAlreadyInTheCart.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      updatedItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          quantity,
        },
      });
    }

    res.status(200).json({
      message: "Panier mis à jour",
      data: updatedItem,
    });
  } catch (err) {
    next(err);
  }
}

////////////////////////////////////////////////
// Controller pour supprimer un item du panier//
///////////////////////////////////////////////

export async function deleteItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.userId);
  const productId = parseInt(req.params.productId);

  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "panier introuvable." });
    }
    const deletedItem = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (deletedItem.count === 0) {
      return res
        .status(404)
        .json({ message: "Item non trouvé dans le panier." });
    }

    res.status(200).json({ message: "Item supprimé du panier." });
  } catch (err) {
    next(err);
  }
}

////////////////////////////////////////////////////////
// Controller pour  modifié un produit dans le panier //
////////////////////////////////////////////////////////

export async function modifyProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.userId);

  interface Body {
    productId: number;
    quantity: number;
  }

  const { productId, quantity }: Body = req.body;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: "Panier introuvable." });
    }

    const itemToModify = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!itemToModify) {
      return res
        .status(404)
        .json({ message: "Produit non trouvé dans le panier." });
    }

    if (quantity === 0) {
      const deletedItem = await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      return res.status(200).json({
        message: "Produit supprimé car quantité = 0",
        deletedItem,
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemToModify.id },
      data: { quantity },
    });

    return res
      .status(200)
      .json({ message: "Quantité du produit modifiée", updatedItem });
  } catch (err) {
    next(err);
  }
}

/////////////////////////////////////
// Controller pour clear le panier //
/////////////////////////////////////

export async function clearCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.userId);
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
    });
    if (!cart) {
      return res.status(404).json({ message: "panier introuvable." });
    }
    const clear = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    res.status(200).json({ message: "panier vidé", clear });
  } catch (err) {
    next(err);
  }
}
