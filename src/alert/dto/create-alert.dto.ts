import { Priority } from "@prisma/client";
import { ArrayMinSize, IsNotEmpty, IsString } from "class-validator";

export class CreateAlertDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  priority: Priority;

  @IsNotEmpty()
  @ArrayMinSize(1)
  linesIds: number[];
}
