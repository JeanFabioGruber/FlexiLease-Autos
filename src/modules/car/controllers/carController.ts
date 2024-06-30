import { Request, Response } from "express";
import CarService from "../services/carServices";
import {
  formatDeleteCarResponse,
  formatErrorResponse,
} from "../response/carResponse";

export default class CarController {
  carService = new CarService();

  createCar = async (req: Request, res: Response): Promise<void> => {
    try {
      const newCar = await this.carService.registerCar(req.body);
      res.status(201).json(newCar);
    } catch (error) {
      res
        .status(400)
        .json(
          formatErrorResponse(400, "Bad Request", error.message, [
            { field: "car", message: error.message },
          ])
        );
    }
  };

  getCars = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cars, total } = await this.carService.getCars(req.query);
      const { offset = 1, limit = 4 } = req.query;

      res.json({
        cars,
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

  getCarById = async (req: Request, res: Response): Promise<void> => {
    try {
      const car = await this.carService.getCarById(req.params.id);
      if (!car) {
        res
          .status(404)
          .json(
            formatErrorResponse(404, "Not Found", "Carro não encontrado.", [])
          );
        return;
      }
      res.json(car);
    } catch (error) {
      res
        .status(400)
        .json(formatErrorResponse(400, "Bad Request", "ID inválido.", []));
    }
  };

  updateCar = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedCar = await this.carService.updateCar(
        req.params.id,
        req.body
      );
      if (!updatedCar) {
        res
          .status(404)
          .json(
            formatErrorResponse(404, "Not Found", "Carro não encontrado.", [])
          );
        return;
      }
      res.json(updatedCar);
    } catch (error) {
      res
        .status(400)
        .json(formatErrorResponse(400, "Bad Request", "ID inválido.", []));
    }
  };

  deleteCar = async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedCar = await this.carService.deleteCar(req.params.id);
      const deleteResponse = formatDeleteCarResponse();
      if (!deletedCar) {
        res
          .status(404)
          .json(
            formatErrorResponse(404, "Not Found", "Carro não encontrado.", [])
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

  modifyAccessory = async (req: Request, res: Response): Promise<void> => {
    try {
      const modifiedCar = await this.carService.modifyAccessory(
        req.params.id,
        req.body
      );
      if (!modifiedCar) {
        res
          .status(404)
          .json(
            formatErrorResponse(
              404,
              "Not Found",
              "Carro não encontrado ou acessório não especificado.",
              []
            )
          );
        return;
      }
      res.json(modifiedCar);
    } catch (error) {
      res
        .status(400)
        .json(
          formatErrorResponse(
            400,
            "Bad Request",
            "Erro ao modificar acessório.",
            []
          )
        );
    }
  };
}
