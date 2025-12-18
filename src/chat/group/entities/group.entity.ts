import { Conversation } from "../../conversation/entities/conversation.entity";

class Member {
  userId: number;
  role: string;
}

export class Group {
  name: string;
  owner_id: number;
  members: Member[];
  created_at: Date;
  avatar?: string;
  conversations: Conversation[];
}
