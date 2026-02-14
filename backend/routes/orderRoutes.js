import express from "express";
import {
  cancelOrder,
  cancelOrderByAdmin,
  createOrder,
  deleteOrderByAdmin,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const orderRouter = express.Router();

/* ================= USER ROUTES ================= */

// create order
orderRouter.post("/", protect, createOrder);

// get my orders
orderRouter.get("/myorders", protect, getMyOrders);

// get order by id
orderRouter.get("/:id", protect, getOrderById);

// pay order
orderRouter.put("/:id/pay", protect, updateOrderToPaid);

// ✅ USER CANCEL ORDER
orderRouter.put("/:id/cancel", protect, cancelOrder);


/* ================= ADMIN ROUTES ================= */

// get all orders
orderRouter.get("/", protect, admin, getAllOrders);

// mark delivered
orderRouter.put("/:id/deliver", protect, admin, updateOrderToDelivered);

// ✅ ADMIN CANCEL (DIFFERENT PATH)
orderRouter.put("/:id/cancel/admin", protect, admin, cancelOrderByAdmin);

// delete order
orderRouter.delete("/:id", protect, admin, deleteOrderByAdmin);

export default orderRouter;
