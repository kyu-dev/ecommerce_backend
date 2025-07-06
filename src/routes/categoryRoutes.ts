import {
  createCategory,
  deleteCategory,
} from "@/controllers/categoryController";
import { authenticateJWT } from "@/middleware/authHandler";
import express from "express";

const router = express.Router();

router.post("/create", authenticateJWT, createCategory);
router.delete("/delete", authenticateJWT, deleteCategory);
