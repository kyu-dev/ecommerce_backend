import express from "express";
import {
  addItems,
  getCart,
  deleteItem,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/:userId", addItems);
router.delete("/:userId/item/:productId", deleteItem);

export default router;
