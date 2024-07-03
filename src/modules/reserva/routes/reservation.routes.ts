import { Router } from "express";
import ReservationController from "../controllers/reservationController";
import { authenticateToken } from "../../../utils/authUtils";

const router = Router();
const reservationController = new ReservationController();

router.post(
  "/reservations",
  authenticateToken,
  reservationController.createReservation
);
router.get(
  "/reservations",
  authenticateToken,
  reservationController.getReservations
);
router.get(
  "/reservations/:id",
  authenticateToken,
  reservationController.getReservationById
);
router.put(
  "/reservations/:id",
  authenticateToken,
  reservationController.updateReservation
);
router.delete(
  "/reservations/:id",
  authenticateToken,
  reservationController.deleteReservation
);

export default router;
