import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Group } from "./entities/group.entity";
import {
  ResponseInterface,
  ResponseInterfaceMessage,
} from "src/utils/interfaces/response.interface";
import { CreateGroupDto } from "./dto/create-group.dto";
import { GroupService } from "./group.service";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { MemberDto } from "./dto/member.dto";

@Controller("groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<ResponseInterface<Group>> {
    const newGroup = await this.groupService.create(createGroupDto);
    return {
      data: { newGroup },
      message: "Un nouveau groupe vient d'être créé",
    };
  }

  @Get()
  async findAll(): Promise<ResponseInterface<Group[]>> {
    const groups = await this.groupService.findAll();
    return {
      data: { groups },
      message: "Voici la liste de tout les groupes",
    };
  }

  @Patch(":_id")
  async update(
    @Param() _id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<ResponseInterface<Group>> {
    const updatedGroup = await this.groupService.update(_id, updateGroupDto);
    return {
      data: { updatedGroup },
      message: `Le groupe ${updateGroupDto.name} a été mis à jours`,
    };
  }

  @Patch("add-member/:_id")
  async addMember(
    @Param() _id: string,
    @Body() member: MemberDto,
  ): Promise<ResponseInterface<Group>> {
    const updatedGroup = await this.groupService.addMember(_id, member);
    return {
      data: { updatedGroup },
      message: `Le membre ${member.userId} a été ajouté au groupe ${updatedGroup.name}`,
    };
  }

  @Patch("remove-member/:_id")
  async removeMember(
    @Param() _id: string,
    @Body() userId: string,
  ): Promise<ResponseInterface<Group>> {
    const updatedGroup = await this.groupService.removeMember(_id, userId);
    return {
      data: { updatedGroup },
      message: `Le membre ${userId} a été retiré du groupe ${updatedGroup.name} a été mis à jours`,
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
