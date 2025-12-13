import { Test } from "@nestjs/testing";
import { DatabaseUserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthService } from "../auth/auth.service";
import { TokenService } from "../auth/token.service";
import { JwtService } from "@nestjs/jwt";
import { RoleEnum, StatusEnum, User } from "@prisma/client";

describe("UserService", () => {
  const prismaMock = {
    user: {
      findUniqueOrThrow: jest.fn(),
    },
  };

  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DatabaseUserRepository,
        UserService,
        { provide: PrismaService, useValue: prismaMock },
        AuthService,
        TokenService,
        JwtService,
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  describe("When the getUserByEmail function is called", () => {
    const emailExist = "Delphia51@hotmail.com";
    const emailNotExist = "john.doe@mail.com";
    const user: User = {
      id: "1321sdf-563s5d4f6sf",
      email: emailExist,
      password: "hashPass",
      firstName: "john",
      lastName: "Doe",
      hiredAt: new Date(),
      isConnected: true,
      isActive: true,
      status: StatusEnum.CONFIRMED,
      createdAt: new Date(),
      updatedAt: new Date(),
      avatarUrl: null,
      role: RoleEnum.DRIVER,
    };
    const error = {
      prismaCode: "P2025",
      timestamp: new Date(),
      path: "/auth/signin",
      message: "Record does not exist",
      requestBody: {
        email: "florian44@hotmail.com",
      },
    };

    it("Should return a notFound errror when the email is not exist", async () => {
      prismaMock.user.findUniqueOrThrow.mockResolvedValue(error);
      const result = await userService.getUserByEmail(emailNotExist);
      expect(result).toBe(error);
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email: emailNotExist },
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it("Should return the user with the right email", async () => {
      prismaMock.user.findUniqueOrThrow.mockResolvedValue(user);

      // use real function
      const result = await userService.getUserByEmail(emailExist);

      expect(result).toBeDefined();
      expect(result).toBe(user);
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledTimes(2);
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email: emailExist },
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });
});
