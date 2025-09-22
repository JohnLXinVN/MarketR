import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Trong production, hãy thay bằng domain của frontend
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');
  // Lưu trữ map giữa userId và socketId để biết gửi tin nhắn cho ai
  private connectedUsers: Map<number, string> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Xóa user khỏi map khi họ ngắt kết nối
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  /**
   * Lắng nghe sự kiện "identify" từ client để đăng ký userId
   */
  @SubscribeMessage('identify')
  handleIdentify(
    client: Socket,
    @MessageBody() data: { userId: number },
  ): void {
    if (data.userId) {
      this.connectedUsers.set(data.userId, client.id);
      this.logger.log(
        `User ${data.userId} identified with socket ${client.id}`,
      );
    }
  }

  /**
   * Hàm này sẽ được các service khác gọi để gửi cập nhật số dư
   */
  sendBalanceUpdate(
    userId: number,
    data: { walletBalance: number; totalDeposited: number },
  ) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('balanceUpdated', data);
      this.logger.log(
        `Sent balance update to user ${userId} on socket ${socketId}`,
      );
    }
  }
}
