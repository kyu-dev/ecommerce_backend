import express from "express";
import { addItems, getCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/:userId", addItems);

export default router;
