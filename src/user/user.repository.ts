import { Prisma, StatusEnum, User } from "@prisma/client";
import {
  UserRepositoryInterface,
  SafeUserResponse,
} from "./interface/user.interface";
import {
  CreateUserDto,
  CreateUserDtoForGoogleOauth,
} from "./dto/create-user.dto";
import { PrismaService } from "prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class DatabaseUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateUserDto | CreateUserDtoForGoogleOauth,
    status: StatusEnum,
  ): Promise<SafeUserResponse> {
    return await this.prisma.user.create({
      data: { ...data, hiredAt: new Date(data.hiredAt), status },
      omit: { password: true, createdAt: true, updatedAt: true },
    });
  }
  async findMany(): Promise<SafeUserResponse[]> {
    const orderBy = [
      { role: Prisma.SortOrder.desc },
      { createdAt: Prisma.SortOrder.desc },
    ];
    const omit = { password: true, createdAt: true, updatedAt: true };
    const include = {
      assignedLines: {
        include: { line: true },
      },
      assignedTrains: {
        include: { train: true },
      },
    };
    return this.prisma.user.findMany({ orderBy, omit, include });
  }

  async findOne(id: string): Promise<SafeUserResponse> {
    const where: Prisma.UserWhereUniqueInput = { id };
    const omit = { password: true, createdAt: true, updatedAt: true };
    const include = {
      assignedLines: {
        include: { line: true },
      },
      assignedTrains: {
        include: { train: true },
      },
    };
    return await this.prisma.user.findUniqueOrThrow({ where, omit, include });
  }

  async findOneByEmail(email: string): Promise<User> {
    const omit = { createdAt: true, updatedAt: true };
    return this.prisma.user.findUniqueOrThrow({ where: { email }, omit });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }
}
