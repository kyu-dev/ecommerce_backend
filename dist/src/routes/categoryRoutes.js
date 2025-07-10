"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryController_1 = require("../controllers/categoryController");
const authHandler_1 = require("../middleware/authHandler");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/create", authHandler_1.authenticateJWT, categoryController_1.createCategory);
router.delete("/delete/:id", authHandler_1.authenticateJWT, categoryController_1.deleteCategory);
router.get("/get", categoryController_1.getAllCategories);
exports.default = router;
