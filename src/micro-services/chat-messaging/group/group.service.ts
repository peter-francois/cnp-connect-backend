import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { Group } from "./entities/group.entity";
import { CreateGroupDto } from "./dto/create-group.dto";

import { UpdateGroupDto } from "./dto/update-group.dto";
import { MemberDto } from "./dto/member.dto";
import { ClientNatsBase } from "../../../utils/client-nats/client-nats-base";

@Injectable()
export class GroupService extends ClientNatsBase {
  async create(createGroupeDto: CreateGroupDto): Promise<Group> {
    const responce: Group = await lastValueFrom(
      this.clientNats.send("group.create", createGroupeDto),
    );
    return responce;
  }

  async findAll(): Promise<Group[]> {
    const responce: Group[] = await lastValueFrom(
      this.clientNats.send("group.findAll", {}),
    );
    return responce;
  }

  async findOne(id: string): Promise<Group> {
    const responce: Group = await lastValueFrom(
      this.clientNats.send("group.findOne", id),
    );
    return responce;
  }

  async update(id: string, updateGroup: UpdateGroupDto): Promise<Group> {
    const response: Group = await lastValueFrom(
      this.clientNats.send("group.update", { id, ...updateGroup }),
    );
    return response;
  }

  async deleteOne(_id: string) {
    await lastValueFrom(this.clientNats.send("group.remove", _id));
    return;
  }

  async addMember(id: string, member: MemberDto) {
    const response: Group = await lastValueFrom(
      this.clientNats.send("group.addMember", { id, member }),
    );
    return response;
  }

  async removeMember(id: string, userId: string) {
    const response: Group = await lastValueFrom(
      this.clientNats.send("group.removeMember", { id, userId }),
    );
    return response;
  }
}
