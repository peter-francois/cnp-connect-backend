import { Injectable } from "@nestjs/common";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { PrismaService } from "prisma/prisma.service";
import { Alert } from "@prisma/client";
import { AlertWithLineAlertInterface } from "./interfaces/alertInterface";

@Injectable()
export class AlertService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlertDto: CreateAlertDto, userId: string): Promise<Alert> {
    const { content, priority, linesIds } = createAlertDto;
    const newAlert = await this.prisma.alert.create({
      data: {
        content,
        priority,
        userId,
        lineAlert: {
          create: linesIds.map((lineId) => ({
            Line: {
              connect: { id: lineId },
            },
          })),
        },
      },
    });
    return newAlert;
  }

  async findAll(): Promise<AlertWithLineAlertInterface[]> {
    return this.prisma.alert.findMany({
      include: {
        lineAlert: {
          include: {
            Line: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} alert`;
  }
  async findManyByLineId(lineId: number): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: { lineAlert: { some: { lineId } } },
    });
  }
  // update(id: number, updateAlertDto: UpdateAlertDto) {
  //   return `This action updates a #${id} alert`;
  // }

  remove(id: number) {
    return `This action removes a #${id} alert`;
  }
}
