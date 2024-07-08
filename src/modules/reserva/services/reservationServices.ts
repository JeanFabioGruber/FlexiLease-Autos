import { Reservation, IReservation } from "../models/reservationModels";
import { User, IUser } from "../../user/models/userModels";
import { Car, ICar } from "../../car/models/carModels";
import { reservationCreateSchema } from "../validation/reservationCreateValidation";
import { reservationUpdateSchema } from "../validation/reservationUpdateValidation";
import {
  formatReservationForResponse,
  formatReservationsForResponse,
} from "../response/reservationResponse";

export default class ReservationService {
  async registerReservation(reqBody: any): Promise<any> {
    // Validate request body
    const { error } = reservationCreateSchema.validate(reqBody);
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }

    const { start_date, end_date, id_user, id_car } = reqBody;

    const user: IUser | null = await User.findById(id_user);
    if (!user || user.qualified !== "sim") {
      throw new Error(
        `O usuário com ID ${id_user} não possui uma carteira de motorista válida.`
      );
    }

    const existingReservationSameDay = await Reservation.findOne({
      id_car,
      $or: [
        { start_date: { $lte: start_date }, end_date: { $gte: start_date } },
        { start_date: { $lte: end_date }, end_date: { $gte: end_date } },
      ],
    });
    if (existingReservationSameDay) {
      throw new Error(
        `Já existe uma reserva para o carro com ID ${id_car} no mesmo dia.`
      );
    }

    const existingReservationSamePeriod = await Reservation.findOne({
      id_user,
      $or: [
        { start_date: { $lte: start_date }, end_date: { $gte: start_date } },
        { start_date: { $lte: end_date }, end_date: { $gte: end_date } },
      ],
    });
    if (existingReservationSamePeriod) {
      throw new Error(
        `O usuário com ID ${id_user} já possui uma reserva que se sobrepõe ao mesmo período.`
      );
    }

    const isValidUser = await User.findById(id_user);
    const isValidCar = await Car.findById(id_car);

    if (!isValidUser) {
      throw new Error(`ID de usuário inválido: ${id_user}`);
    }

    if (!isValidCar) {
      throw new Error(`ID de carro inválido: ${id_car}`);
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const carInfo: ICar | null = await Car.findById(id_car);
    if (!carInfo) {
      throw new Error(
        `Não foi possível encontrar informações do carro com ID: ${id_car}`
      );
    }

    const { value_per_day } = carInfo;
    const final_value = diffDays * value_per_day;

    const newReservation: IReservation = new Reservation({
      id_user,
      id_car,
      start_date: startDate,
      end_date: endDate,
      final_value,
    });

    const savedReservation = await newReservation.save();

    return formatReservationForResponse(savedReservation);
  }

  async getReservations(queryParams: any): Promise<{
    reservations: any[];
    total: number;
    limit: number;
    offset: number;
    offsets: number;
  }> {
    const { offset = 1, limit = 10 } = queryParams;
    const numericOffset = Number(offset);
    const numericLimit = Number(limit);

    const [reservations, total] = await Promise.all([
      Reservation.find()
        .skip((numericOffset - 1) * numericLimit)
        .limit(numericLimit),
      Reservation.countDocuments(),
    ]);

    return {
      ...formatReservationsForResponse(
        reservations,
        total,
        numericLimit,
        numericOffset
      ),
      limit: numericLimit,
      offset: numericOffset,
      offsets: Math.ceil(total / numericLimit),
    };
  }

  async getReservationById(id: string): Promise<any | null> {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return null;
    }
    return formatReservationForResponse(reservation);
  }

  async updateReservation(id: string, updateBody: any): Promise<any | null> {
    // Validate update body
    const { error } = reservationUpdateSchema.validate(updateBody);
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }

    const { start_date, end_date, id_car } = updateBody;

    // Verificar se o carro já tem reserva para o próximo dia
    if (start_date || end_date) {
      const existingReservationSameDay = await Reservation.findOne({
        id_car,
        $or: [
          { start_date: { $lte: start_date }, end_date: { $gte: start_date } },
          { start_date: { $lte: end_date }, end_date: { $gte: end_date } },
        ],
      });
      if (existingReservationSameDay) {
        throw new Error(
          `O carro com ID ${id_car} já possui uma reserva para o próximo dia.`
        );
      }
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { $set: updateBody },
      { new: true }
    );

    if (!updatedReservation) {
      return null;
    }

    return formatReservationForResponse(updatedReservation);
  }

  async deleteReservation(id: string): Promise<boolean> {
    const deletedReservation = await Reservation.findByIdAndDelete(id);
    return !!deletedReservation;
  }
}
