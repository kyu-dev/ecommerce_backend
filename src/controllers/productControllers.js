import prisma from '../db/prismaClient.js'
//fonction pour créer un produit
export async function createProduct (req, res, next){
    const {name,description,price,stock }= req.body
    try{
        //query prisma pour créer un product
        const product = await prisma.product.create({
            data:{
                name: name,
                description: description,
                price: price,
                stock: stock
            }
        });
        
        res.json({
            message: "Produit créé avec succès",
            product
        });
        
    }catch(err){
        next(err)
    }
}