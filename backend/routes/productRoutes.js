import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByIds,
} from "../controllers/productController.js";

import { uploadProductMedia } from "../middlewares/uploadMiddleware.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const productRouter = express.Router();

// 🔓 PUBLIC
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/by-ids", getProductsByIds);


// 🔐 ADMIN ONLY
productRouter.post(
  "/",
  protect,
  admin,
  uploadProductMedia,
  createProduct
);

productRouter.put(
  "/:id",
  protect,
  admin,
  uploadProductMedia,
  updateProduct
);

productRouter.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);

export default productRouter;
