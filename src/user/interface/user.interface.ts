import { Prisma, StatusEnum, User } from "@prisma/client";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { DefaultArgs } from "@prisma/client/runtime/library";

export interface UserRepositoryInterface {
  findOneByEmail(email: string): Promise<User>;
  create(data: CreateUserDto, status: StatusEnum): Promise<User>;
  findMany(
    omit: Prisma.UserOmit<DefaultArgs> | null | undefined,
    include: Prisma.UserInclude<DefaultArgs> | null | undefined,
    orderBy:
      | Prisma.UserOrderByWithRelationInput
      | Prisma.UserOrderByWithRelationInput[]
      | undefined,
  ): Promise<UserSigninResponse[]>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
}

export type UserSigninResponse = Omit<
  User,
  "password" | "createdAt" | "updatedAt"
>;
