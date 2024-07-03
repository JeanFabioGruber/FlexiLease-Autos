import { IReservation } from "../models/reservationModels";

export function formatReservationForResponse(reservation: IReservation): any {
  return {
    _id: reservation._id,
    id_user: reservation.id_user,
    id_car: reservation.id_car,
    start_date: reservation.start_date,
    end_date: reservation.end_date,
    final_value: reservation.final_value,
  };
}

export function formatReservationsForResponse(
  reservations: IReservation[],
  total: number,
  limit: number,
  offset: number
): any {
  return {
    reservations: reservations.map((reservation) =>
      formatReservationForResponse(reservation)
    ),
    total,
    limit,
    offset,
    offsets: Math.ceil(total / limit),
  };
}

export function formatUpdateReservationResponse(
  reservation: IReservation | null
): any {
  if (!reservation) {
    return null;
  }
  return formatReservationForResponse(reservation);
}

export function formatReservationByIdForResponse(
  reservation: IReservation | null
): any {
  if (!reservation) {
    return null;
  }
  return formatReservationForResponse(reservation);
}

export function formatDeleteReservationResponse(): any {
  return {
    message: "Reserva deletada com sucesso.",
  };
}

export function formatErrorResponse(
  code: number,
  status: string,
  message: string,
  details: Array<{ field?: string; message: string }> = []
): object {
  return {
    code,
    status,
    message,
    details,
  };
}
