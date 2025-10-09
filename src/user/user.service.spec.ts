import { Test } from "@nestjs/testing";
import { DatabaseUserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../../prisma/prisma.service";
import { RoleEnum, StatusEnum, User } from "@prisma/client";

const prismaMock = {
  user: {
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
  },
};

describe("userService", () => {
  let userService: UserService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        DatabaseUserRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    userService = moduleRef.get<UserService>(UserService);
  });
  //   it("ok", async () => {
  //     const response = await userService.getUserByEmail("peter@hot.fr");
  //     console.log("🚀 ~ user.service.spec.ts:29 ~ response:", response);
  //   });
  describe("When the getUserByEmail method is called", () => {
    it("When the getUserByEmail return user", async () => {
      const emailExist = "test@test.fr";
      const user: User = {
        id: "EUIZVBNo-vbhjkn",
        email: emailExist,
        password: "zefiunb",
        firstName: "Peter",
        lastName: "Francois",
        hiredAt: new Date(),
        status: StatusEnum.CONFIRMED,
        isConnected: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: RoleEnum.COORDINATOR,
      };
      prismaMock.user.findUniqueOrThrow.mockResolvedValue<User>(user);
      const result = await userService.getUserByEmail(emailExist);
      console.log("🚀 ~ user.service.spec.ts:50 ~ result:", result);
      expect(result).toEqual(user);
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email: emailExist },
      });
    });
  });
});
