import { RoleEnum, StatusEnum, User } from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";

export const mockUser: User = {
  id: faker.string.alpha({ length: 10 }),
  email: faker.internet.email(),
  password: faker.string.alphanumeric({ length: 10, casing: "mixed" }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  hiredAt: new Date(),
  avatarUrl: faker.internet.url(),
  createdAt: new Date(),
  updatedAt: new Date(),
  status: StatusEnum.CONFIRMED,
  isConnected: true,
  isActive: true,
  role: RoleEnum.COORDINATOR,
};
