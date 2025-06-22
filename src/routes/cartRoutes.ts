import express from "express";
import {
  addItems,
  getCart,
  deleteItem,
  modifyProduct,
  clearCart,
} from "../controllers/cartController.ts";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/:userId", addItems);
router.delete("/:userId/item/:productId", deleteItem);
router.put("/:userId", modifyProduct);
router.delete("/:userId/clearCart", clearCart);

export default router;
