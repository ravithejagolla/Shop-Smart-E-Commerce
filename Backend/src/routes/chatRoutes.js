import express from "express";
import { askAssistant, syncEmbeddings } from "../controllers/chatController.js";
import { authentication } from "../middlewares/authMiddleware.js";

const chatRoutes = express.Router();

// Main route for users to interact with Assistant
// Note: You can make it authentication required if you only want logged-in users to use the AI
chatRoutes.post("/ask", askAssistant);

// Hidden utility route to manually force seed all database products into vectors
chatRoutes.post("/sync", syncEmbeddings);

export { chatRoutes };
