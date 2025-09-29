import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
import { ResponseInterface } from "src/interfaces/Data.interface";
import { User } from "@prisma/client";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseInterface<User>> {
    const user = await this.userService.create(createUserDto);
    if (!user) throw new NotFoundException("No user created");

    return {
      data: { user },
      message: "Un nouvel utilisation vient d'être créé",
    };
  }

  @Get()
  async findAll(): Promise<ResponseInterface<User[]>> {
    const user = await this.userService.findAll();
    return {
      data: { user },
      message: "Voici tous les utilisateurs",
    };
  }

  @Get(":email")
  async findByEmail(
    @Param("email") email: string,
  ): Promise<ResponseInterface<User>> {
    const user = await this.userService.findOneByEmail(email);
    return {
      data: { user },
      message: "Voici le user",
    };
  }

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
