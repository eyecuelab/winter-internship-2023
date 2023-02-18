import roleControllers from "../Controllers/role";
import express from "express";
const router = express.Router();
router.get("/role/:id", roleControllers.getRoleById);
router.post("/role", roleControllers.createRole);
export default router;