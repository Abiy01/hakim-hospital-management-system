import express from "express";
import {
  deleteMessage,
  getAllMessages,
  getMessageById,
  sendMessage,
  updateMessage,
} from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

// Public route
router.post("/send", sendMessage);

// Admin routes - Message CRUD
router.get("/getall", isAdminAuthenticated, getAllMessages);
router.get("/:id", isAdminAuthenticated, getMessageById);
router.put("/:id", isAdminAuthenticated, updateMessage);
router.delete("/:id", isAdminAuthenticated, deleteMessage);

export default router;