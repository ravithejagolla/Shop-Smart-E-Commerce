import express from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { createPaymentOrder } from "../controllers/paymentcontroller.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/createOrder", authentication, createPaymentOrder);

export { paymentRoutes };