import express from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/productControllers.js";
const router = express.Router();

router.post("/create", createProduct);
router.get("/get", getProducts);

export default router;
