import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import { AlertService } from "./alert.service";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { ResponseInterface } from "src/utils/interfaces/response.interface";
import { Alert } from "@prisma/client";
import { AccesTokenGuard } from "src/auth/guard/access-token.guard";
import type {
  PayloadInterface,
  RequestWithPayloadInterface,
} from "src/auth/interfaces/payload.interface";
import { AlertWithLineAlertInterface } from "./interfaces/alertInterface";

@UseGuards(AccesTokenGuard)
@Controller("alerts")
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  async create(
    @Body() createAlertDto: CreateAlertDto,
    @Req() req: RequestWithPayloadInterface,
  ): Promise<ResponseInterface<Alert>> {
    const user: PayloadInterface = req.user;
    const alert = await this.alertService.create(createAlertDto, user.id);
    // add new alert in linealerte
    return {
      data: { alert },
      message: "Un nouvelle alerte a été créé.",
    };
  }

  //@dev faire une interface pour la réponse car on a les ligne avec
  @Get()
  async findAll(): Promise<ResponseInterface<AlertWithLineAlertInterface[]>> {
    const alerts = await this.alertService.findAll();
    return {
      data: { alerts },
      message: "Voici la liste de toutes les alertes.",
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.alertService.findOne(+id);
  }

  @Get("lines/:lineId")
  async findManyByLineId(
    @Param("lineId", ParseIntPipe) lineId: number,
  ): Promise<ResponseInterface<Alert[]>> {
    const alerts = await this.alertService.findManyByLineId(lineId);
    return {
      data: { alerts },
      message: `Voici la liste des alertes de la ligne ${lineId}.`,
    };
  }
}
