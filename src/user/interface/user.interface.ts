import { StatusEnum, User } from "@prisma/client";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface UserRepositoryInterface {
  findOneByEmail(email: string): Promise<User>;
  create(data: CreateUserDto, status: StatusEnum): Promise<User>;
  findMany(): Promise<UserSigninResponse[]>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
}

export type UserSigninResponse = Omit<
  User,
  "password" | "createdAt" | "updatedAt"
>;
