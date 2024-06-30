import axios from "axios";
import { IUser, User } from "../models/userModels";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { generateToken } from "../../../utils/jwtUtils";
import { userCreateSchema } from "../validation/userCreateValidation";
import { userUpdateSchema } from "../validation/userUpdateValidation";
import {
  formatUserForResponse,
  formatUsersForResponse,
  formatUserByIdForResponse,
} from "../response/userResponse";

export default class UserService {
  async createUser(reqBody: any): Promise<any> {
    const { name, cpf, birth, email, password, cep, qualified } = reqBody as {
      name: string;
      cpf: string;
      birth: Date;
      email: string;
      password: string;
      cep: string;
      qualified: string;
    };

    const { error } = userCreateSchema.validate(reqBody);
    if (error) {
      throw new Error(`Erro de validação: ${error.message}`);
    }

    if (!cpfValidator.isValid(cpf)) {
      throw new Error("CPF inválido.");
    }

    const cpfExists = await User.findOne({ cpf });
    if (cpfExists) {
      throw new Error("CPF já registrado.");
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new Error("E-mail já registrado.");
    }

    const birthDate = new Date(birth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      throw new Error("O usuário deve ter pelo menos 18 anos.");
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const address = response.data;

    if (address.erro) {
      throw new Error("CEP inválido.");
    }

    const newUser: IUser = new User({
      name,
      cpf,
      birth,
      email,
      password,
      cep,
      address: {
        logradouro: address.logradouro || "N/A",
        complemento: address.complemento || "N/A",
        bairro: address.bairro || "N/A",
        localidade: address.localidade || "N/A",
        uf: address.uf || "N/A",
      },
      qualified,
    });

    await newUser.save();

    return formatUserForResponse(newUser);
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    const user = await User.findOne({ email, password });

    if (!user) {
      return null;
    }

    const token = generateToken(user._id.toString());
    return token;
  }

  async getUsers(): Promise<IUser[]> {
    const users = await User.find();
    return formatUsersForResponse(users);
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    return formatUserByIdForResponse(user);
  }

  async updateUser(id: string, updateBody: any): Promise<IUser | null> {
    const { error } = userUpdateSchema.validate(updateBody);
    if (error) {
      throw new Error(`Erro de validação na atualização: ${error.message}`);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateBody },
      { new: true }
    );

    if (!updatedUser) {
      return null;
    }

    return formatUserForResponse(updatedUser);
  }

  async deleteUser(id: string): Promise<IUser | null> {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return null;
    }
    return formatUserForResponse(deletedUser);
  }
}
