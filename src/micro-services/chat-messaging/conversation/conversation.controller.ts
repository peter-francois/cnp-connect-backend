import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { UpdateConversationDto } from "./dto/update-conversation.dto";
import { ParticipantDto } from "./dto/participant.dto";
import {
  ResponseInterface,
  ResponseInterfaceMessage,
} from "src/utils/interfaces/response.interface";
import { Conversation } from "./entities/conversation.entity";

@Controller("conversations")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async create(
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<ResponseInterface<Conversation>> {
    const createdConversation = await this.conversationService.create(
      createConversationDto,
    );
    return {
      data: { createdConversation },
      message: `La conversation ${createdConversation.label} a été créé`,
    };
  }

  @Get()
  async findAll(): Promise<ResponseInterface<Conversation[]>> {
    const conversations = await this.conversationService.findAll();
    return {
      data: { conversations },
      message: `Voici la liste de toutes les conversations`,
    };
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
  ): Promise<ResponseInterface<Conversation>> {
    const conversation = await this.conversationService.findOne(id);
    return {
      data: { conversation },
      message: `Voici la conversation ${conversation.label}`,
    };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ): Promise<ResponseInterface<Conversation>> {
    const updatedConversation = await this.conversationService.update(
      id,
      updateConversationDto,
    );
    return {
      data: { updatedConversation },
      message: `Voici la conversation ${updateConversationDto.label} mis à jour`,
    };
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<ResponseInterfaceMessage> {
    await this.conversationService.deleteOne(id);
    return {
      message: "La conversation a été supprimé",
    };
  }
  @Patch("add-participant/:_id")
  async addParticipant(
    @Param() _id: string,
    @Body() participant: ParticipantDto,
  ): Promise<ResponseInterface<Conversation>> {
    const updatedConversation = await this.conversationService.addParticipant(
      _id,
      participant,
    );
    return {
      data: { updatedConversation },
      message: `Le membre ${participant.userId} a été ajouté a la conversation ${updatedConversation.label}`,
    };
  }

  @Patch("remove-participant/:_id")
  async removeParticipant(
    @Param() _id: string,
    @Body() userId: string,
  ): Promise<ResponseInterface<Conversation>> {
    const updatedConversation =
      await this.conversationService.removeParticipant(_id, userId);
    return {
      data: { updatedConversation },
      message: `Le membre ${userId} a été retiré de la conversation ${updatedConversation.label} a été mis à jours`,
    };
  }
}
