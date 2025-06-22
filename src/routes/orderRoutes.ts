import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.ts";
const router = express.Router();

router.post("/:userId", createOrder);
router.get("/:userId", getOrders);
export default router;
