import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  HttpStatus,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { CustomException } from "src/utils/custom-exception";
import { ResponseInterface } from "src/utils/interfaces/response.interface";

@Controller("template")
export class TemplateController {
  private readonly natsSubject = "notification.template";
  constructor(@Inject("NATS_SERVICE") private clientNats: ClientProxy) {}

  @Post()
  async create(@Body() body: unknown): Promise<ResponseInterface<unknown>> {
    return lastValueFrom(
      this.clientNats.send(`${this.natsSubject}.create`, body),
    );
  }

  @Get()
  async findAll(): Promise<ResponseInterface<unknown>> {
    const templates = await lastValueFrom(
      this.clientNats.send(`${this.natsSubject}.findAll`, {}),
    );

    if (!templates)
      throw new CustomException("Not Found", HttpStatus.NOT_FOUND, "TC-fa-1");

    return { data: templates, message: "Aucune templates trouvées." };
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.templateService.findOne(+id);
  // }

  // @Patch(":id")
  // update(
  //   @Param("id") id: string,
  //   @Body() updateTemplateDto: UpdateTemplateDto,
  // ) {
  //   return this.templateService.update(+id, updateTemplateDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.templateService.remove(+id);
  // }
}
