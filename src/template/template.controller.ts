import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TemplateService } from "./template.service";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { CreateTemplateDto } from "./dto/create-template.dto";

@Controller("template")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  create(@Body() body: CreateTemplateDto) {
    return this.templateService.create(body);
  }

  @Get()
  findAll() {
    return this.templateService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.templateService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.templateService.update(+id, updateTemplateDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.templateService.remove(+id);
  }
}
