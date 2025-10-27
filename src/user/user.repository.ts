import { StatusEnum, User } from "@prisma/client";
import { UserRepositoryInterface } from "./interface/user.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";

// a revoir

@Injectable()
export class DatabaseUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  // @dev changé le prima pour ne pas prendre le createdat et le updated at?
  async findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({ where: { email } });
  }

  async create(data: CreateUserDto, status: StatusEnum): Promise<User> {
    return await this.prisma.user.create({
      data: { ...data, hiredAt: new Date(data.hiredAt), status },
    });
  }

  async findMany(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }
}
