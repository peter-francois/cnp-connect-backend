import { Prisma, StatusEnum, User } from "@prisma/client";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface UserRepositoryInterface {
  findOneByEmail(options: Prisma.UserFindUniqueOrThrowArgs): Promise<User>;
  create(data: CreateUserDto, status: StatusEnum): Promise<SafeUserResponse>;
  findMany(options?: Prisma.UserFindManyArgs): Promise<SafeUserResponse[]>;
  findOne(options?: Prisma.UserFindManyArgs): Promise<SafeUserResponse>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
}

export type SafeUserResponse = Omit<
  User,
  "password" | "createdAt" | "updatedAt"
>;
