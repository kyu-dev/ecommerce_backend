import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "@/controllers/categoryController";
import { authenticateJWT } from "@/middleware/authHandler";
import express from "express";

const router = express.Router();

router.post("/create", authenticateJWT, createCategory);
router.delete("/delete/:id", authenticateJWT, deleteCategory);
router.get("/get", getAllCategories as any);

export default router;
