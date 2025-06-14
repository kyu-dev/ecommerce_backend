import express from "express";
import { getCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCart);

export default router;
