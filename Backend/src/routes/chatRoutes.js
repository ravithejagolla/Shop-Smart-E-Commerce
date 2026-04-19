import express from "express";
import { askAssistant, syncEmbeddings } from "../controllers/chatController.js";
import { authentication } from "../middlewares/authMiddleware.js";

const chatRoutes = express.Router();

// Main route for users to interact with Assistant
// Protected by authentication so only logged-in users can use the AI
chatRoutes.post("/ask", authentication, askAssistant);

// Hidden utility route to manually force seed all database products into vectors
// Also protected by authentication
chatRoutes.post("/sync", authentication, syncEmbeddings);

export { chatRoutes };
