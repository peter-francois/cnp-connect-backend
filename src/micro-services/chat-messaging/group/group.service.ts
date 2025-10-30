import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { Group } from "./entities/group.entity";
import { CreateGroupDto } from "./dto/create-group.dto";
import { ClientNatsBase } from "../client-nats-base";

@Injectable()
export class GroupService extends ClientNatsBase {
  async createGroup(createGroupeDto: CreateGroupDto) {
    const responce: Group = await lastValueFrom(
      this.clientNats.send("group.create", createGroupeDto),
    );
    return responce;
  }

  async findAll() {
    const responce: Group = await lastValueFrom(
      this.clientNats.send("group.findAll", {}),
    );
    return responce;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} chatMessaging`;
  // }

  // update(id: number, updateChatMessagingDto: UpdateChatMessagingDto) {
  //   return `This action updates a #${id} chatMessaging`;
  // }

  async deleteOne(_id: string) {
    await lastValueFrom(this.clientNats.send("group.remove", _id));
    return;
  }
}
