/**
 * Data Transfer Objects for WebSocket chat messages.
 *
 * Defines the structure of all messages exchanged between client and server
 * in the WebSocket chat system.
 */

/**
 * Message sent by client to introduce themselves after connection.
 */
export interface WelcomeUserMessage {
  type: "welcome_user";
  username: string;
}

/**
 * Message sent by client containing chat text.
 */
export interface ClientChatMessage {
  type: "message";
  username: string;
  text: string;
}

/**
 * Message sent by server to acknowledge connection and assign username.
 */
export interface WelcomeResponseMessage {
  type: "welcome";
  assignedUsername: string;
}

/**
 * Message broadcast by server containing chat text with timestamp.
 */
export interface ServerChatMessage {
  messageId: string;
  type: "message";
  senderId: string;
  content: string;
  timestamp: string;
}

/**
 * Message broadcast by server when a user joins the chat.
 */
export interface UserJoinedMessage {
  type: "user_joined";
  username: string;
}

/**
 * Message broadcast by server when a user leaves the chat.
 */
export interface UserLeftMessage {
  type: "user_left";
  username: string;
}

/**
 * Message sent by server to notify client of an error.
 */
export interface ErrorMessage {
  type: "error";
  message: string;
}

/**
 * Union type of all messages that can be sent from client to server.
 */
export type ClientMessage = WelcomeUserMessage | ClientChatMessage;

/**
 * Union type of all messages that can be sent from server to client.
 */
export type ServerMessage =
  | WelcomeResponseMessage
  | ServerChatMessage
  | UserJoinedMessage
  | UserLeftMessage
  | ErrorMessage;
