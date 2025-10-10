import { faker } from "@faker-js/faker";
import { AuthService } from "./auth.service";
import { Test } from "@nestjs/testing";

describe("authService", () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it("Should be defined", () => {
    expect(authService).toBeDefined();
  });

  it("Should validate the hash for the same string", async () => {
    const toHash = faker.string.alphanumeric(10);
    const hash = await authService.hash(toHash);
    const compare = await authService.compare(hash, toHash);
    expect(compare).toBe(true);
  });
});
