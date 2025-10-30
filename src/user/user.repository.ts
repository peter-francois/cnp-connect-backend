import { Prisma, StatusEnum, User } from "@prisma/client";
import {
  UserRepositoryInterface,
  SafeUserResponse,
} from "./interface/user.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class DatabaseUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateUserDto,
    status: StatusEnum,
  ): Promise<SafeUserResponse> {
    return await this.prisma.user.create({
      data: { ...data, hiredAt: new Date(data.hiredAt), status },
      omit: { password: true, createdAt: true, updatedAt: true },
    });
  }
  async findMany(
    options?: Prisma.UserFindManyArgs,
  ): Promise<SafeUserResponse[]> {
    return this.prisma.user.findMany(options);
  }

  async findOneByEmail(
    options: Prisma.UserFindUniqueOrThrowArgs,
  ): Promise<User> {
    return this.prisma.user.findUniqueOrThrow(options);
  }

  async findOne(
    options: Prisma.UserFindUniqueOrThrowArgs,
  ): Promise<SafeUserResponse> {
    return await this.prisma.user.findUniqueOrThrow(options);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }
}
