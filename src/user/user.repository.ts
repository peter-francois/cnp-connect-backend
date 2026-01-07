import { Prisma, StatusEnum, User } from "@prisma/client";
import { UserRepositoryInterface } from "./interface/user.interface";
import { PrismaService } from "../../prisma/prisma.service";
import { Injectable } from "@nestjs/common";

const omit = { password: true, createdAt: true, updatedAt: true };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userWithAssignedLineAndTrain = Prisma.validator<Prisma.UserDefaultArgs>()(
  {
    include: { assignedLines: true, trainTravel: true },
    omit,
  },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const safeUser = Prisma.validator<Prisma.UserDefaultArgs>()({
  omit,
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
      omit,
    });
  }

  async findMany(): Promise<SafeUserResponseWithAssignedLineAndTrainPrisma[]> {
    const orderBy = [
      { role: Prisma.SortOrder.desc },
      { createdAt: Prisma.SortOrder.desc },
    ];
    const include = {
      assignedLines: {
        include: { line: true },
      },
      trainTravel: {
        include: { train: true },
      },
    };
    return this.prisma.user.findMany({ orderBy, omit, include });
  }

  async findOneWithAssignedLineAndTrainPrisma(
    id: string,
  ): Promise<SafeUserResponseWithAssignedLineAndTrainPrisma> {
    const where: Prisma.UserWhereUniqueInput = { id };
    const include = {
      assignedLines: {
        include: { line: true },
      },
      trainTravel: {
        include: { train: true },
      },
    };
    return await this.prisma.user.findUniqueOrThrow({ where, omit, include });
  }

  async findOneById(id: string): Promise<SafeUserResponsePrisma> {
    return this.prisma.user.findUniqueOrThrow({ where: { id }, omit });
  }

  async findOneByEmail(email: string): Promise<User> {
    const omitWithPassword = { createdAt: true, updatedAt: true };
    return this.prisma.user.findUniqueOrThrow({
      where: { email },
      omit: omitWithPassword,
    });
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }
}
