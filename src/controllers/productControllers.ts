import prisma from "../db/prismaClient";
import { Request, Response, NextFunction } from "express";

////////////////////////////////////
//Controller pour créer un produit//
//////////////////////////////////////////

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, description, price, stock } = req.body;
  try {
    // Query Prisma pour créer un produit
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        stock: stock,
      },
    });

    res.status(201).json({
      message: "Produit créé avec succès",
      product,
    });
  } catch (err) {
    next(err); // On passe l'erreur au middleware d'erreur
  }
}

//////////////////////////////////////////
//Controller pour récupérer les produits//
/////////////////////////////////////////

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    interface WhereClause {
      name?: {
        contains: string;
        mode: "insensitive";
      };
      price?: {
        gte?: number;
        lte?: number;
      };
      stock?: {
        gt?: number;
        lte?: number;
      };
      id?: number;
    }

    const { name, minPrice, maxPrice, stock, id } = req.query;
    const where: WhereClause = {}; //condition initialisé vide

    if (name) {
      where.name = {
        contains: String(name),
        mode: "insensitive", //ignore upercase et lowercase
      };
    }

    if (maxPrice || minPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(String(minPrice)); // plus grand ou égal à
      }
      if (maxPrice) {
        where.price.lte = parseFloat(String(maxPrice)); // plus petit ou égal à
      }
    }

    if (stock === "true") {
      where.stock = { gt: 0 }; //en stock
    }
    if (stock === "false") {
      where.stock = { lte: 0 }; // en rupture
    }

    if (id) {
      where.id = parseInt(String(id)); //reçois un entier
    }

    const data = await prisma.product.findMany({ where });
    res.status(200).json({ message: "Produits Trouvé", data });
  } catch (err) {
    next(err);
  }
}

////////////////////////////////////////////////////////////
// Controller pour modifier un produit à partir de son id //
////////////////////////////////////////////////////////////

export async function modifyProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const productId = req.params.id;
  const { name, description, price, stock } = req.body;
  try {
    const data = await prisma.product.update({
      data: {
        name: name,
        description: description,
        price: price,
        stock: stock,
      },
      where: {
        id: parseInt(productId),
      },
    });
    res.status(200).json({ message: "Produit modifié", data });
  } catch (err) {
    next(err);
  }
}

///////////////////////////////////////
// Controller pour delete un produit //
///////////////////////////////////////
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const productId = req.params.id;
  try {
    const data = await prisma.product.delete({
      where: {
        id: parseInt(productId),
      },
    });
    res.status(200).json({ message: "Produit supprimé", data });
  } catch (err) {
    next(err);
  }
}
