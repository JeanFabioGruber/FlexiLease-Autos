import { Request, Response } from "express";
import UserService from "../services/userServices";
import {
  formatUsersForResponse,
  formatUserByIdForResponse,
  formatDeleteUserResponse,
  formatErrorResponse,
} from "../response/userResponse";

export default class UserController {
  userService = new UserService();

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUser = await this.userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res
        .status(400)
        .json(
          formatErrorResponse(400, "Bad Request", error.message, [
            { field: "user", message: error.message },
          ])
        );
    }
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.loginUser(email, password);
      if (!user) {
        res
          .status(401)
          .json(
            formatErrorResponse(
              401,
              "Unauthorized",
              "E-mail ou senha inválidos.",
              []
            )
          );
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res
        .status(400)
        .json(formatErrorResponse(400, "Bad Request", error.message, []));
    }
  };

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getUsers();
      const formattedUsers = formatUsersForResponse(users);
      res.json(formattedUsers);
    } catch (error) {
      res
        .status(400)
        .json(formatErrorResponse(400, "Bad Request", error.message, []));
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      const formattedUser = formatUserByIdForResponse(user);
      if (!formattedUser) {
        res
          .status(404)
          .json(
            formatErrorResponse(404, "Not Found", "Usuário não encontrado.", [])
          );
        return;
      }
      res.json(formattedUser);
    } catch (error) {
      res
        .status(400)
        .json(formatErrorResponse(400, "Bad Request", "ID inválido.", []));
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedUser = await this.userService.updateUser(
        req.params.id,
        req.body
      );
      if (!updatedUser) {
        res
          .status(404)
          .json(
            formatErrorResponse(404, "Not Found", "Usuário não encontrado.", [])
          );
        return;
      }
      res.json(updatedUser);
    } catch (error) {
      res
        .status(400)
        .json(formatErrorResponse(400, "Bad Request", "ID inválido.", []));
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedUser = await this.userService.deleteUser(req.params.id);
      const deleteResponse = formatDeleteUserResponse();
      if (!deletedUser) {
        res
          .status(404)
          .json(
            formatErrorResponse(404, "Not Found", "Usuário não encontrado.", [])
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
