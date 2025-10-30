import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export abstract class ClientNatsBase {
  constructor(
    @Inject("NATS_SERVICE") protected readonly clientNats: ClientProxy,
  ) {}
}
