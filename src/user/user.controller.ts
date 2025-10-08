import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
import { StatusEnum, User } from "@prisma/client";
import { ResponseInterface } from "src/utils/interfaces/response.interface";
import { AccesTokenGuard } from "src/auth/guard/access-token.guard";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccesTokenGuard)
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    status: StatusEnum = StatusEnum.NOT_CONFIRMED,
  ): Promise<ResponseInterface<User>> {
    const user = await this.userService.createUser(createUserDto, status);
    return {
      data: { user },
      message: "Un nouvel utilisation vient d'être créé",
    };
  }

  // @Get()
  // async findAll(): Promise<ResponseInterface<User[]>> {
  //   const user = await this.userService.findAll();
  //   return {
  //     data: { user },
  //     message: "Voici tous les utilisateurs",
  //   };
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.userService.remove(+id);
  // }
}
