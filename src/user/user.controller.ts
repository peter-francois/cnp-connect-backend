import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
import { StatusEnum, User } from "@prisma/client";
import { ResponseInterface } from "src/utils/interfaces/response.interface";
import { AccesTokenGuard } from "src/auth/guard/access-token.guard";
import { SupervisorGuard } from "src/auth/guard/supervisor.guard";
import { CoordinatorGuard } from "src/auth/guard/coordinator.guard";
import { SafeUserResponse } from "./interface/user.interface";
import { UpdateUserDto } from "./dto/update-user.dto";

@UseGuards(AccesTokenGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(SupervisorGuard)
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    status: StatusEnum = StatusEnum.NOT_CONFIRMED,
  ): Promise<ResponseInterface<SafeUserResponse>> {
    const user: SafeUserResponse = await this.userService.createUser(
      createUserDto,
      status,
    );
    return {
      data: { user },
      message: "Un nouvel utilisation vient d'être créé",
    };
  }

  // @UseGuards(CoordinatorGuard)
  @Get()
  // @dev put limit
  async findAll(): Promise<ResponseInterface<SafeUserResponse[]>> {
    const users: SafeUserResponse[] =
      await this.userService.findManyWithLinesAndTrains();
    return {
      data: { users },
      message: "Voici tous les utilisateurs",
    };
  }

  // @dev refaire comme les autre pour avoir le meme type de retour
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOneWithLinesAndTrains(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseInterface<SafeUserResponse>> {
    const userUpdated: SafeUserResponse = await this.userService.update(
      id,
      updateUserDto,
    );
    return {
      data: { userUpdated },
      message: "Voici l'utilisateur mis à jour",
    };
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.userService.remove(+id);
  // }
}
