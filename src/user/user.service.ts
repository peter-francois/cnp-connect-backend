import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
// import { PrismaService } from "prisma/prisma.service";
import { StatusEnum, User } from "@prisma/client";
import { DatabaseUserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: DatabaseUserRepository) {}

  // async findAll() {
  //   return this.prisma.user.findMany();
  // }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByEmail(email);
  }
  async createUser(data: CreateUserDto, status: StatusEnum): Promise<User> {
    return this.userRepository.create(data, status);
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
