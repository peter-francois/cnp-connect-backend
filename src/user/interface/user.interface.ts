import { StatusEnum, User } from "@prisma/client";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface UserRepositoryInterface {
  create(data: CreateUserDto, status: StatusEnum): Promise<SafeUserResponse>;
  findMany(): Promise<SafeUserResponse[]>;
  findOneWithAssignedLineAndTrainPrisma(id: string): Promise<SafeUserResponse>;
  findOneByEmail(email: string): Promise<User>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
}

export type SafeUserResponse = Omit<
  User,
  "password" | "createdAt" | "updatedAt"
>;
