import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
import { StatusEnum, User } from "@prisma/client";
import { ResponseInterface } from "src/utils/interfaces/response.interface";
import { AccesTokenGuard } from "src/auth/guard/access-token.guard";
import { SupervisorGuard } from "src/auth/guard/supervisor.guard";
import { CoordinatorGuard } from "src/auth/guard/coordinator.guard";
import { createCipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

// @UseGuards(AccesTokenGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(SupervisorGuard)
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    status: StatusEnum = StatusEnum.NOT_CONFIRMED,
  ): Promise<ResponseInterface<User>> {
    const user: User = await this.userService.createUser(createUserDto, status);
    return {
      data: { user },
      message: "Un nouvel utilisation vient d'être créé",
    };
  }

  // @UseGuards(CoordinatorGuard)
  @Get()
  async findAll(): Promise<ResponseInterface<User[]>> {
    const iv = randomBytes(16);
    const password = "Password used to generate key";

    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(password, "salt", 32)) as Buffer;
    const cipher = createCipheriv("aes-256-ctr", key, iv);

    const textToEncrypt = "Nest";
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);
    console.log("🚀 ~ user.controller.ts:47 ~ findAll ~ encryptedText:", encryptedText)
    const users: User[] = await this.userService.findAll();
    return {
      data: { users },
      message: "Voici tous les utilisateurs",
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
