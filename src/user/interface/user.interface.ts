import { StatusEnum, User } from "@prisma/client";
import { CreateUserDto } from "../dto/create-user.dto";

export interface UserRepositoryInterface {
  findOneByEmail(email: string): Promise<User>;
  create(data: CreateUserDto, status: StatusEnum): Promise<User>;
  findMany(): Promise<User[]>;
}

// export interface UserRepositoryInterface<T> {
//   findOneByEmail(email: string): Promise<User>;
//   create(data: T, status: StatusEnum): Promise<User>;
// }

export type UserSigninResponse = Omit<
  User,
  "password" | "createdAt" | "updatedAt"
>;
