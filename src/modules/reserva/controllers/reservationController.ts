import { Request, Response } from "express";
import ReservationService from "../services/reservationServices";
import {
  formatDeleteReservationResponse,
  formatErrorResponse,
} from "../response/reservationResponse";

export default class ReservationController {
  reservationService = new ReservationService();

  createReservation = async (req: Request, res: Response): Promise<void> => {
    try {
      const newReservation = await this.reservationService.registerReservation(
        req.body
      );
      res.status(201).json(newReservation);
    } catch (error) {
      res
        .status(400)
        .json(
          formatErrorResponse(400, "Bad Request", error.message, [
            { field: "reservation", message: error.message },
          ])
        );
    }
  };

  getReservations = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reservations, total } =
        await this.reservationService.getReservations(req.query);
      const { offset = 1, limit = 10 } = req.query;

      res.json({
        reservations,
        total,
        limit: Number(limit),
        offset: Number(offset),
        offsets: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      res
        .status(400)
        .json(formatErrorResponse(400, "Bad Request", error.message, []));
    }
  };

  getReservationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservation = await this.reservationService.getReservationById(
        req.params.id
      );
      if (!reservation) {
        res
          .status(404)
          .json(
            formatErrorResponse(404, "Not Found", "Reserva não encontrada.", [])
          );
        return;
      }
      res.json(reservation);
    } catch (error) {
      res
        .status(400)
        .json(formatErrorResponse(400, "Bad Request", "ID inválido.", []));
    }
  };

  updateReservation = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedReservation =
        await this.reservationService.updateReservation(
          req.params.id,
          req.body
        );
      if (!updatedReservation) {
        res
          .status(404)
          .json(
            formatErrorResponse(404, "Not Found", "Reserva não encontrada.", [])
          );
        return;
      }
      res.json(updatedReservation);
    } catch (error) {
      res
        .status(400)
        .json(formatErrorResponse(400, "Bad Request", "ID inválido.", []));
    }
  };

  deleteReservation = async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedReservation =
        await this.reservationService.deleteReservation(req.params.id);
      const deleteResponse = formatDeleteReservationResponse();
      if (!deletedReservation) {
        res
          .status(404)
          .json(
            formatErrorResponse(404, "Not Found", "Reserva não encontrada.", [])
          );
        return;
      }
      res.status(204).json(deleteResponse);
    } catch (error) {
      res
        .status(400)
        .json(formatErrorResponse(400, "Bad Request", "ID inválido.", []));
    }
  };
}
