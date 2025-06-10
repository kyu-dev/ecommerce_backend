import express from "express";
import { sayHello } from "../controllers/authControllers";
const router = express.Router();

router.get("/", sayHello);

export default router;
