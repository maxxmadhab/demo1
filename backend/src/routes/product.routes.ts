import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { validateProductQuery } from "../validators/product.validator.js";

const router = Router();

router.get("/products", validateProductQuery, productController.list);
router.get("/products/:slug", productController.getBySlug);
router.get("/collections/:collection/products", productController.getByCollection);

export default router;