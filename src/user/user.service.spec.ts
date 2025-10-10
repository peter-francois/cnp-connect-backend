import { Test } from "@nestjs/testing";
import { DatabaseUserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../../prisma/prisma.service";
import { User } from "@prisma/client";
import { mockUser } from "../utils/__test__/mock";

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
    it("Should return a user when email exist", async () => {
      const emailExist = "test@test.fr";
      const user: User = mockUser;
      prismaMock.user.findUniqueOrThrow.mockResolvedValue(user);
      const result = await userService.getUserByEmail(emailExist);
      expect(result).toEqual(user);
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email: emailExist },
      });
    });

    it("Should throw an error when the email doesn't exist", async () => {
      const otherEmail = "jhon@doe.fr";
      const error = new Error("User not found");
      prismaMock.user.findUniqueOrThrow.mockRejectedValueOnce(error);

      await expect(userService.getUserByEmail(otherEmail)).rejects.toThrow(
        "User not found",
      );

      expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email: otherEmail },
      });
    });
  });
});
