import { HttpStatus, Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { CustomException } from "src/utils/custom-exception";

@Injectable()
export class AuthService {
  hash(data: string): Promise<string> {
    try {
      return argon2.hash(data);
    } catch {
      throw new CustomException("BadRequest", HttpStatus.BAD_REQUEST, "AS-h-1");
    }
  }

  compare(hashed: string, noHashed: string): Promise<boolean> {
    try {
      return argon2.verify(hashed, noHashed);
    } catch {
      throw new CustomException("BadRequest", HttpStatus.BAD_REQUEST, "AS-c-1"); // a voir si c'est util revoir
    }
  }
}
