import { Request, Response, NextFunction } from "express";
import prisma from "../db/prismaClient";

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
