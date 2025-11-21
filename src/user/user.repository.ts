import { Prisma, StatusEnum, User } from "@prisma/client";
import { UserRepositoryInterface } from "./interface/user.interface";
import { PrismaService } from "prisma/prisma.service";
import { Injectable } from "@nestjs/common";

const userWithAssignedLineAndTrain = Prisma.validator<Prisma.UserDefaultArgs>()(
  {
    include: { assignedLines: true, assignedTrains: true },
    omit: { password: true, createdAt: true, updatedAt: true },
  },
);

const safeUser = Prisma.validator<Prisma.UserDefaultArgs>()({
  omit: { password: true, createdAt: true, updatedAt: true },
});

type SafeUserResponsePrisma = Prisma.UserGetPayload<typeof safeUser>;

type SafeUserResponseWithAssignedLineAndTrainPrisma = Prisma.UserGetPayload<
  typeof userWithAssignedLineAndTrain
>;

@Injectable()
export class DatabaseUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.UserCreateInput,
    status: StatusEnum,
  ): Promise<SafeUserResponsePrisma> {
    return await this.prisma.user.create({
      data: { ...data, hiredAt: new Date(data.hiredAt), status },
      omit: { password: true, createdAt: true, updatedAt: true },
    });
  }

  async findMany(): Promise<SafeUserResponseWithAssignedLineAndTrainPrisma[]> {
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

  async findOne(
    id: string,
  ): Promise<SafeUserResponseWithAssignedLineAndTrainPrisma> {
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

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }
}
