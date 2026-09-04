import { Router } from "express";
import { adminProductController } from "../controllers/admin-product.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { validateProductQuery } from "../validators/product.validator.js";

const router = Router();

router.use(requireAdmin);

router.get("/admin/products", validateProductQuery, adminProductController.list);
router.post("/admin/products", adminProductController.create);
router.get("/admin/products/:id", adminProductController.getById);
router.put("/admin/products/:id", adminProductController.update);
router.delete("/admin/products/:id", adminProductController.remove);

router.post("/admin/upload", adminProductController.upload);
router.delete("/admin/images", adminProductController.deleteImage);

export default router;
