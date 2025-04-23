import express from "express";
import { createOrder, getOrdersForUser, getOrderById, updateOrderStatus, getAllOrders, getOrdersByStatus} from "../controllers/orderController.js";
import { authentication, authorizeRoles } from "../middlewares/authMiddleware.js";

const OrderRouter = express.Router();
OrderRouter.post("/", authentication, createOrder);
OrderRouter.get("/user", authentication, getOrdersForUser);
OrderRouter.get("/:orderId", authentication, authorizeRoles("admin"), getOrderById);
OrderRouter.put("/:orderId/status", authentication, authorizeRoles("admin"), updateOrderStatus);
OrderRouter.get("/admin/all", authentication,authorizeRoles("admin"), getAllOrders);
OrderRouter.get("/admin/status", authentication,authorizeRoles("admin"), getOrdersByStatus);

export default OrderRouter;
