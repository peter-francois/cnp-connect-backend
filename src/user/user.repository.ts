import { Prisma, StatusEnum, User } from "@prisma/client";
import {
  UserRepositoryInterface,
  UserSigninResponse,
} from "./interface/user.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DefaultArgs } from "@prisma/client/runtime/client";

// interface FindAllInterface {
//   orderBy?:
//     | Prisma.UserOrderByWithRelationInput
//     | Prisma.UserOrderByWithRelationInput[]
//     | undefined;
//   omit?: Prisma.UserOmit<DefaultArgs> | null | undefined;
//   include?: Prisma.UserInclude<DefaultArgs> | null | undefined;
// }

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

  // async findMany(): Promise<UserSigninResponse[]> {
  //   return this.prisma.user.findMany({
  //     orderBy: {
  //       createdAt: Prisma.SortOrder.desc,
  //     },
  //     omit: { password: true, createdAt: true, updatedAt: true },
  //     include: {
  //       assignedLines: {
  //         include: { line: true },
  //       },
  //       assignedTrains: {
  //         include: { train: true },
  //       },
  //     },
  //   });
  // }

  async findMany(
    omit?: Prisma.UserOmit<DefaultArgs> | null,
    include?: Prisma.UserInclude<DefaultArgs> | null,
    orderBy?:
      | Prisma.UserOrderByWithRelationInput
      | Prisma.UserOrderByWithRelationInput[],
  ): Promise<UserSigninResponse[]> {
    return this.prisma.user.findMany({ orderBy, omit, include });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }
}
