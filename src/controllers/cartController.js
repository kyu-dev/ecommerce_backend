import prisma from "../db/prismaClient.js";

/////////////////////////////////////////
// Controller pour récuperer le panier //
/////////////////////////////////////////
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
export async function addItems(req, res, next) {
  const userId = parseInt(req.params.userId);
  const { productId, quantity } = req.body;
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Panier introuvable pour cet utilisateur." });
    }

    const itemAlreadyInTheCart = await prisma.cartItem.findFirst({
      // regarde si l'item est dejà dans le panier
      where: {
        cartId: cart.id,
        productId: parseInt(productId),
      },
    });

    let updatedItem;

    if (itemAlreadyInTheCart) {
      updatedItem = await prisma.cartItem.update({
        // update la quantité si l'item est déjà dans le panier
        where: { id: itemAlreadyInTheCart.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      updatedItem = await prisma.cartItem.create({
        // ajoute l'item si il n'existe pas
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
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
