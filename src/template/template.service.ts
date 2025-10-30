import { Inject, Injectable } from "@nestjs/common";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { Template } from "./entities/template.entity";
import { CreateTemplateDto } from "./dto/create-template.dto";

@Injectable()
export class TemplateService {
  constructor(@Inject("NATS_SERVICE") private clientNats: ClientProxy) {}

  async create(payload: CreateTemplateDto): Promise<Template> {
    return lastValueFrom(this.clientNats.send("template.create", payload));
  }

  findAll() {
    return `This action returns all template`;
  }

  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
