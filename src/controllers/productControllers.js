import prisma from "../db/prismaClient.js";

//Controller pour créer un produit
export async function createProduct(req, res, next) {
  const { name, description, price, stock } = req.body;
  try {
    //query prisma pour créer un product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        stock: stock,
      },
    });

    res.json({
      message: "Produit créé avec succès",
      product,
    });
  } catch (err) {
    next(err); //on passe l'erreur au midleware d'erreur
  }
}

//Controller pour récupérer les produits
export async function getProducts(req, res, next) {
  try {
    const { name, minPrice, maxPrice } = req.query;
    const where = {}; //condition initialisé vide

    if (name) {
      where.name = {
        contains: String(name),
        mode: "insensitive", //ignore upercase et lowercase
      };
    }

    if (maxPrice || minPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice); // plus grand ou égal à
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice); // plus petit ou égal à
      }
    }

    const data = await prisma.product.findMany({ where });
    res.status(200).json({ message: "Produits Trouvé", data });
  } catch (err) {
    next(err);
  }
}
