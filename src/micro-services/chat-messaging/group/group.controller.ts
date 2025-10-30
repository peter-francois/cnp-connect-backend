import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { Group } from "./entities/group.entity";
import {
  ResponseInterface,
  ResponseInterfaceMessage,
} from "src/utils/interfaces/response.interface";
import { CreateGroupDto } from "./dto/create-group.dto";
import { GroupService } from "./group.service";

@Controller("groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<ResponseInterface<Group>> {
    const newGroup = await this.groupService.createGroup(createGroupDto);
    return {
      data: { newGroup },
      message: "Un nouveau groupe vient d'être créé",
    };
  }

  @Get()
  async findAll() {
    const groups = await this.groupService.findAll();
    return {
      data: { groups },
      message: "Voici la liste de tout les groupes",
    };
  }

  @Delete(":_id")
  async delete(@Param() _id: string): Promise<ResponseInterfaceMessage> {
    await this.groupService.deleteOne(_id);
    return {
      message: "Le groupe a été supprimé",
    };
  }
}
