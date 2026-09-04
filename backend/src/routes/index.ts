import { Router } from "express";
import healthRoutes from "./health.routes.js";
import productRoutes from "./product.routes.js";
import adminProductRoutes from "./admin-product.routes.js";

const router = Router();

router.use(healthRoutes);
router.use(productRoutes);
router.use(adminProductRoutes);

export default router;