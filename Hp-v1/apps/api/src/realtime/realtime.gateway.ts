import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '../auth/jwt.strategy';

/**
 * Namespaced Socket.IO for VM metrics, ticket updates, and billing events.
 * Client sends JWT in `handshake.auth.token` or `Authorization` bearer (parsed in middleware if added).
 */
@WebSocketGateway({
  namespace: '/realtime',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly log = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(private readonly jwt: JwtService) {}

  handleConnection(client: Socket) {
    const raw =
      (client.handshake.auth?.token as string | undefined) ??
      client.handshake.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!raw) {
      this.log.warn(`Socket ${client.id} rejected: no token`);
      client.disconnect(true);
      return;
    }
    try {
      const payload = this.jwt.verify<JwtPayload>(raw);
      client.data.userId = payload.sub;
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.log.debug(`Socket ${client.id} disconnected`);
  }

  /** Emit to all sockets for a user (called from services after DB writes). */
  emitToUser(userId: string, event: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  /** VM room for noVNC-adjacent signaling or graph fanout. */
  joinVmRoom(client: Socket, vmId: string) {
    if (!client.data.userId) return;
    client.join(`vm:${vmId}`);
  }
}
