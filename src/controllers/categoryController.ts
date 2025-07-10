import { Request, Response, NextFunction } from "express";
import prisma from "@/db/prismaClient";

// controller de creation de category
export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({
      data: { name: name },
    });

    res.status(201).json({
      message: "Produit créé avec succès",
      category,
    });
  } catch (err) {
    next(err);
  }
}

// controller pour delete une category
export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id); // Convertir l'ID en nombre
  try {
    const category = await prisma.category.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      message: "Catégorie supprimée avec succès",
      category,
    });
  } catch (err) {
    next(err);
  }
}

// controller pour afficher les category avec les produit associé
export async function getAllCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true, // Inclure les produits associés à chaque catégorie
      },
    });

    if (categories.length === 0) {
      return res.status(404).json({ message: "Aucune catégorie trouvée" });
    }

    res.status(200).json({
      message: "Catégories récupérées avec succès",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
}
