import { ICar } from "../models/carModels";

export function formatCarForResponse(car: ICar): any {
  return {
    _id: car._id,
    modelo: car.modelo,
    color: car.color,
    year: car.year,
    value_per_day: car.value_per_day,
    accessories: car.accessories.map((accessory) => ({
      description: accessory,
    })),
    number_of_passengers: car.number_of_passengers,
  };
}

export function formatCarsForResponse(
  cars: ICar[],
  total: number,
  limit: number,
  offset: number
): any {
  return {
    cars: cars.map((car) => formatCarForResponse(car)),
    total,
    limit,
    offset,
    offsets: Math.ceil(total / limit),
  };
}

export function formatUpdateCarResponse(car: ICar | null): any {
  if (!car) {
    return null;
  }
  return formatCarForResponse(car);
}

export function formatCarByIdForResponse(car: ICar | null): any {
  if (!car) {
    return null;
  }
  return formatCarForResponse(car);
}

export function formatDeleteCarResponse(): any {
  return {
    message: "Carro deletado com sucesso.",
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
