import { IsNumber, IsString } from "class-validator";

export class MemberDto {
  @IsNumber()
  userId: number;
  @IsString()
  role: string;
}
