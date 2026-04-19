import express from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { createStripeCheckoutSession } from "../controllers/paymentcontroller.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/create-checkout-session", authentication, createStripeCheckoutSession);

export { paymentRoutes };