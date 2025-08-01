import prisma from "@/db/prismaClient";
import { Request, Response, NextFunction } from "express";

////////////////////////////////////
//Controller pour créer un produit//
//////////////////////////////////////////

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    name,
    description,
    price,
    stock,
    alcoholDegree,
    img,
    categoryId,
    rating,
    volumeId,
  } = req.body;
  try {
    // Gestion du rating : float entre 0 et 5
    let safeRating = 0;
    if (rating !== undefined && rating !== null) {
      const parsedRating = parseFloat(rating);
      if (isNaN(parsedRating) || parsedRating < 0) safeRating = 0;
      else if (parsedRating > 5) safeRating = 5;
      else safeRating = parsedRating;
    }
    // Query Prisma pour créer un produit
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        stock: stock,
        alcoholDegree: alcoholDegree ? parseFloat(alcoholDegree) : null,
        img: img,
        categoryId: parseInt(categoryId),
        rating: safeRating,
        volumeId: parseInt(volumeId),
      },
      include: {
        category: true, // Inclure la catégorie dans la réponse
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
    type WhereClause = {
      name?: {
        contains: string;
        mode: "insensitive";
      };
      price?: {
        gte?: number;
        lte?: number;
      };
      rating?: {
        gte?: number;
        lte?: number;
      };
      stock?: {
        gt?: number;
        lte?: number;
      };
      id?: number;
      categoryId?: number;
    };

    const {
      name,
      minPrice,
      maxPrice,
      stock,
      id,
      categoryId,
      minRating,
      maxRating,
    } = req.query;
    const where: WhereClause = {}; //condition initialisé vide

    if (name) {
      where.name = {
        contains: String(name),
        mode: "insensitive", //ignore upercase et lowercase
      };
    }

    if (minRating || maxRating) {
      where.rating = {};
      if (minRating) {
        where.rating.gte = parseFloat(String(minRating)); // plus grand ou égal à
      }
      if (maxRating) {
        where.rating.lte = parseFloat(String(maxRating)); // plus petit ou égal à
      }
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
      const product = await prisma.product.findUnique({
        where: { id: parseInt(String(id)) },
        include: { category: true },
      });

      if (!product) {
        return res.status(404).json({ message: "Produit introuvable" });
      }

      return res.status(200).json({ message: "Produit trouvé", data: product });
    }

    if (categoryId) {
      where.categoryId = parseInt(String(categoryId)); //filtre par catégorie
    }

    const data = await prisma.product.findMany({
      where,
      include: {
        category: true, // Inclure la catégorie dans la réponse
      },
    });
    res.status(200).json({ message: "Produits Trouvé", data });
  } catch (err) {
    next(err);
  }
}
/////////////////////////////////////////////////////
// Controller pour récupérer les nouveaus produits //
////////////////////////////////////////////////////
export async function getNewProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Récupère la limite depuis les params, valeur par défaut 10
    const limit = req.params.limit ? parseInt(req.params.limit) : 10;
    const data = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc", // Trie par date de création décroissante
      },
      take: limit, // Limite le nombre de résultats
      include: {
        category: true,
      },
    });
    res.status(200).json({ message: "Produits les plus récents", data });
  } catch (err) {
    next(err);
  }
}
/////////////////////////////////////////////////////
// Controller pour récupérer les meilleur produits //
////////////////////////////////////////////////////
export async function getTopProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.params.limit ? parseInt(req.params.limit) : 10;
    const data = await prisma.product.findMany({
      orderBy: {
        rating: "desc", // Trie par la notation décroissante
      },
      take: limit, // Limite le nombre de résultats
      include: {
        category: true,
      },
    });
    res.status(200).json({ message: "Produits les plus appréciés", data });
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
  const {
    name,
    description,
    price,
    stock,
    alcoholDegree,
    img,
    categoryId,
    rating,
    volumeId,
  } = req.body;
  try {
    // Gestion du rating : float entre 0 et 5
    let safeRating = undefined;
    if (rating !== undefined && rating !== null) {
      const parsedRating = parseFloat(rating);
      if (isNaN(parsedRating) || parsedRating < 0) safeRating = 0;
      else if (parsedRating > 5) safeRating = 5;
      else safeRating = parsedRating;
    }
    const data = await prisma.product.update({
      data: {
        name: name,
        description: description,
        price: price,
        stock: stock,
        alcoholDegree: alcoholDegree ? parseFloat(alcoholDegree) : null,
        img: img,
        volumeId: parseInt(volumeId),
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        ...(safeRating !== undefined ? { rating: safeRating } : {}),
      },
      where: {
        id: parseInt(productId),
      },
      include: {
        category: true, // Inclure la catégorie dans la réponse
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
