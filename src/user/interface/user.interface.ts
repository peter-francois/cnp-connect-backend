import { AssignedLine, StatusEnum, TrainTravel, User } from "@prisma/client";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface UserRepositoryInterface {
  create(
    data: CreateUserDto,
    status: StatusEnum,
  ): Promise<SafeUserWithLineAndTrainTravelResponse>;
  findMany(): Promise<SafeUserWithLineAndTrainTravelResponse[]>;
  findOneWithAssignedLineAndTrainPrisma(
    id: string,
  ): Promise<SafeUserWithLineAndTrainTravelResponse>;
  findOneByEmail(email: string): Promise<User>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
}

export type SafeUserWithLineAndTrainTravelResponse = Omit<
  User,
  "password" | "createdAt" | "updatedAt"
> & {
  assignedLines: AssignedLine[];
  trainTravel: TrainTravel[];
};
