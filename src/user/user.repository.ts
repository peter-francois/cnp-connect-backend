import { Injectable } from "@nestjs/common";
import { StatusEnum, User } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRepositoryInterface } from "./interface/user.interface";

// a revoir

@Injectable()
export class DatabaseUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) { }

  async findOneByEmail(email: string): Promise<User> {

    return this.prisma.user.findUniqueOrThrow({ where: { email } });
  }

  async create(data: CreateUserDto, status: StatusEnum): Promise<User> {
    return await this.prisma.user.create({
      data: { ...data, hiredAt: new Date(data.hiredAt), status },
    });
  }
}
