import express from "express";
import {
  adminMiddleware,
  protectedMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  AllOder,
  CreatOrder,
  CurrentUserOrder,
  DetailOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// post /api/v1/order
router.post("/", protectedMiddleware, CreatOrder);
// post /api/v1/order
router.get("/", protectedMiddleware, adminMiddleware, AllOder);
// post /api/v1/order
router.get("/:id", protectedMiddleware, adminMiddleware, DetailOrder);
// post /api/v1/order
router.get("/current/user", protectedMiddleware, CurrentUserOrder);

export default router;
