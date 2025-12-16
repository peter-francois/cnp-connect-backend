import { IsNumber, IsString } from "class-validator";

export class ParticipantDto {
  @IsNumber()
  userId: number;

  @IsString()
  role: string;
}
