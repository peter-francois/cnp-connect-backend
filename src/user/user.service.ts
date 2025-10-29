import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { Prisma, RoleEnum, StatusEnum, User } from "@prisma/client";
import { DatabaseUserRepository } from "./user.repository";
import { AuthService } from "src/auth/auth.service";
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

  async findMany(): Promise<SafeUserResponse[]> {
    const orderBy = [
      { role: Prisma.SortOrder.desc },
      { createdAt: Prisma.SortOrder.desc },
    ];
    const omit = { password: true, createdAt: true, updatedAt: true };

    return await this.userRepository.findMany({ omit, orderBy });
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
    return await this.userRepository.findOne({ where, omit, include });
  }

  async getUserByEmail(email: string): Promise<User> {
    const omit = { createdAt: true, updatedAt: true };
    return this.userRepository.findOneByEmail({ where: { id: email }, omit });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
