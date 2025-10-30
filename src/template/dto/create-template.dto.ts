import { IsString, IsArray, IsBoolean, IsOptional } from "class-validator";

export class CreateTemplateDto {
  @IsString()
  type: string;

  @IsOptional()
  content?: {
    title?: string;
    message?: string;
  };

  @IsArray()
  @IsOptional()
  variables?: string[];

  @IsOptional()
  @IsString()
  defaultPriority?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
