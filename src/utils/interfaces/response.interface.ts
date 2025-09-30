export interface ResponseInterface<T> extends ResponseInterfaceMessage {
  data: Record<string, T>;
}

export interface ResponseInterfaceMessage {
  message: string;
}
