import { Car } from "../models/carModels";
import { carCreateSchema } from "../validation/carCreateValidation";
import { carUpdateSchema } from "../validation/carUpdateValidation";
import {
  formatCarForResponse,
  formatCarsForResponse,
} from "../response/carResponse";

export default class CarService {
  async registerCar(reqBody: any): Promise<any> {
    const {
      modelo,
      color,
      year,
      value_per_day,
      accessories,
      number_of_passengers,
    } = reqBody;

    const { error } = carCreateSchema.validate(reqBody);
    if (error) {
      throw new Error(`Erro de validação: ${error.message}`);
    }

    if (year < 1950 || year > 2023) {
      throw new Error(
        "O ano de fabricação do carro deve estar entre 1950 e 2023."
      );
    }

    if (accessories.length === 0) {
      throw new Error("É necessário ter pelo menos um acessório.");
    }

    const carExists = await Car.findOne({ modelo });
    if (carExists) {
      throw new Error("Modelo de carro já registrado.");
    }

    const uniqueAccessories = [...new Set(accessories)];

    const newCar = new Car({
      modelo,
      color,
      year,
      value_per_day,
      accessories: uniqueAccessories,
      number_of_passengers,
    });

    await newCar.save();

    return formatCarForResponse(newCar);
  }

  async getCars(queryParams: any): Promise<{
    cars: any[];
    total: number;
    limit: number;
    offset: number;
    offsets: number;
  }> {
    let filter: any = {};

    if (queryParams.model) {
      filter.model = queryParams.model;
    }

    const { offset = 1, limit = 4 } = queryParams;
    const numericOffset = Number(offset);
    const numericLimit = Number(limit);

    const cars = await Car.find(filter)
      .skip((numericOffset - 1) * numericLimit)
      .limit(numericLimit);

    const total = await Car.countDocuments(filter);

    return {
      ...formatCarsForResponse(cars, total, numericLimit, numericOffset),
      limit: numericLimit,
      offset: numericOffset,
      offsets: Math.ceil(total / numericLimit),
    };
  }

  async getCarById(id: string): Promise<any | null> {
    const car = await Car.findById(id);
    if (!car) {
      return null;
    }
    return formatCarForResponse(car);
  }

  async updateCar(id: string, updateBody: any): Promise<any | null> {
    const { error } = carUpdateSchema.validate(updateBody);
    if (error) {
      throw new Error(`Erro de validação na atualização: ${error.message}`);
    }

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { $set: updateBody },
      { new: true }
    );

    if (!updatedCar) {
      return null;
    }

    return formatCarForResponse(updatedCar);
  }

  async deleteCar(id: string): Promise<any | null> {
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return null;
    }
    return deletedCar;
  }

  async modifyAccessory(id: string, reqBody: any): Promise<any | null> {
    const { description } = reqBody;

    if (!description) {
      throw new Error("O campo de descrição é obrigatório.");
    }

    let car = await Car.findById(id);
    if (!car) {
      return null;
    }

    const index = car.accessories.indexOf(description);

    if (index === -1) {
      car.accessories.push(description);
    } else {
      car.accessories = car.accessories.filter((acc) => acc !== description);
    }

    await car.save();

    return formatCarForResponse(car);
  }
}
