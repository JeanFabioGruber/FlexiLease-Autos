import { Router } from "express";
import CarController from "../controllers/carController";
import { authenticateToken } from "../../../utils/authUtils";

const router = Router();
const carController = new CarController();

router.post("/cars", authenticateToken, carController.createCar);
router.get("/cars", authenticateToken, carController.getCars);
router.get("/cars/:id", authenticateToken, carController.getCarById);
router.put("/cars/:id", authenticateToken, carController.updateCar);
router.delete("/cars/:id", authenticateToken, carController.deleteCar);
router.put(
  "/cars/:id/accessories",
  authenticateToken,
  carController.modifyAccessory
);

export default router;
