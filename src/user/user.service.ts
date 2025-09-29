import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "prisma/prisma.service";
import { StatusEnum, User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateUserDto,
    status: StatusEnum = StatusEnum.NOT_CONFIRMED,
  ): Promise<User> {
    return this.prisma.user.create({
      data: { ...data, hiredAt: new Date(data.hiredAt), status },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { email } });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
