import { IUser } from "../models/userModels";

export function formatUserForResponse(user: IUser): any {
  return {
    name: user.name,
    cpf: user.cpf,
    birth: user.birth,
    email: user.email,
    password: user.password,
    cep: user.cep,
    qualified: user.qualified,
    ...user.address,
  };
}

export function formatUsersForResponse(users: IUser[]): any[] {
  return users.map((user) => formatUserForResponse(user));
}

export function formatUserByIdForResponse(user: IUser | null): any {
  if (!user) {
    return null;
  }
  return formatUserForResponse(user);
}

export function formatDeleteUserResponse(): any {
  return {
    message: "Usuário deletado com sucesso.",
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
