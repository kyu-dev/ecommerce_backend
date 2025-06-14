import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  modifyProduct,
} from "../controllers/productControllers.js";
const router = express.Router();

router.post("/create", createProduct);
router.get("/get", getProducts);
router.put("/put/:id", modifyProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
