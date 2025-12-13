import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { StatusEnum, User } from "@prisma/client";
import { DatabaseUserRepository } from "./user.repository";
import { AuthService } from "./../auth/auth.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SafeUserResponse } from "./interface/user.interface";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: DatabaseUserRepository,
    private readonly authService: AuthService,
  ) {}

  async createUser(
    data: CreateUserDto,
    status: StatusEnum,
  ): Promise<SafeUserResponse> {
    // hash password
    data.password = await this.authService.hash(data.password);
    return this.userRepository.create(data, status);
  }

  async findManyWithLinesAndTrains(): Promise<SafeUserResponse[]> {
    return await this.userRepository.findMany();
  }

  async findOneWithLinesAndTrains(id: string): Promise<SafeUserResponse> {
    return await this.userRepository.findOneWithAssignedLineAndTrainPrisma(id);
  }

  async findOneById(id: string): Promise<SafeUserResponse> {
    return await this.userRepository.findOneById(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
