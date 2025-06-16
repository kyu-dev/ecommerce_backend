import express from "express";
import {
  addItems,
  getCart,
  deleteItem,
  modifyProduct,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/:userId", addItems);
router.delete("/:userId/item/:productId", deleteItem);
router.put("/:userId", modifyProduct);

export default router;
