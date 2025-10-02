import { StatusEnum, User } from "@prisma/client";
import { CreateUserDto } from "../dto/create-user.dto";

export interface UserRepository {
  findOneByEmail(email: string): Promise<User>;
  create(data: CreateUserDto, status: StatusEnum): Promise<User>;
}
