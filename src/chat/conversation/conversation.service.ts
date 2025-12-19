import { Injectable } from "@nestjs/common";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { UpdateConversationDto } from "./dto/update-conversation.dto";
import { Conversation } from "./entities/conversation.entity";
import { lastValueFrom } from "rxjs";
import { ParticipantDto } from "./dto/participant.dto";
import { ClientNatsBase } from "src/utils/client-nats/nats-client-base";

@Injectable()
export class ConversationService extends ClientNatsBase {
  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const responce: Conversation = await lastValueFrom(
      this.clientNats.send("conversation.create", createConversationDto),
    );
    return responce;
  }

  async findAll(): Promise<Conversation[]> {
    const responce: Conversation[] = await lastValueFrom(
      this.clientNats.send("conversation.findAll", {}),
    );
    return responce;
  }

  async findOne(id: string): Promise<Conversation> {
    const responce: Conversation = await lastValueFrom(
      this.clientNats.send("conversation.findOne", id),
    );
    return responce;
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
  ): Promise<Conversation> {
    const response: Conversation = await lastValueFrom(
      this.clientNats.send("conversation.update", {
        id,
        ...updateConversationDto,
      }),
    );
    return response;
  }

  async deleteOne(_id: string) {
    await lastValueFrom(this.clientNats.send("conversation.remove", _id));
    return;
  }

  async addParticipant(id: string, participant: ParticipantDto) {
    const response: Conversation = await lastValueFrom(
      this.clientNats.send("conversation.addParticipant", { id, participant }),
    );
    return response;
  }

  async removeParticipant(id: string, userId: string) {
    const response: Conversation = await lastValueFrom(
      this.clientNats.send("conversation.removeParticipant", { id, userId }),
    );
    return response;
  }
}
