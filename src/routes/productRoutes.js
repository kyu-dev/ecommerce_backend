import express from "express";
import {
  createProduct,
  getAllProducts,
} from "../controllers/productControllers.js";
const router = express.Router();

router.post("/create", createProduct);
router.get("/getAll", getAllProducts);

export default router;
