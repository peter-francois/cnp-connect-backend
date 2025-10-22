import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
// import { PrismaService } from "prisma/prisma.service";
import { StatusEnum, User } from "@prisma/client";
import { DatabaseUserRepository } from "./user.repository";
import { AuthService } from "src/auth/auth.service";
import { UserSigninResponse } from "./interface/user.interface";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: DatabaseUserRepository,
    private readonly authService: AuthService,
  ) {}

  async findAll() {
    return await this.userRepository.findMany();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByEmail(email);
  }
  async createUser(data: CreateUserDto, status: StatusEnum): Promise<User> {
    // hash password
    data.password = await this.authService.hash(data.password);
    return this.userRepository.create(data, status);
  }

  signinResponse(user: User): UserSigninResponse {
    const { password, createdAt, updatedAt, ...rest } = user;
    return rest;
  }

  async connected(id: string): Promise<User> {
    return await this.userRepository.connected(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
