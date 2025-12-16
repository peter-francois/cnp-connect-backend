class Participant {
  userId: number;
  joinedAt: string;
  role: string;
}

export class Conversation {
  groupId: string;
  label: string;
  creatorId: string;
  participants: Participant[];
  lastMessageId: string;
  created_at: string;
  updatedAt: string;
}
