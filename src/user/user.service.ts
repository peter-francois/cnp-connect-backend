import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { Prisma, StatusEnum, User } from "@prisma/client";
import { DatabaseUserRepository } from "./user.repository";
import { AuthService } from "src/auth/auth.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: DatabaseUserRepository,
    private readonly authService: AuthService,
  ) {}

  async findMany() {
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
    return await this.userRepository.findMany(omit, include, orderBy);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByEmail(email);
  }
  async createUser(data: CreateUserDto, status: StatusEnum): Promise<User> {
    // hash password
    data.password = await this.authService.hash(data.password);
    return this.userRepository.create(data, status);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
