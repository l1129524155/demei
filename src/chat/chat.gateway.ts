import { UserService } from './../user/user.service';
import { ChatHistory } from '@prisma/client';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { Inject } from '@nestjs/common';

interface JoinRoomPayload {
  chatroomId: number
  userId: number
}

interface SendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: {
    type: 'text' | 'image' | 'file',
    content: string,
    name: string,
    size: string,
    district: string,
    weight: number
    numIndex?: number
    weights?: object[]
  }
}

@WebSocketGateway({cors: { origin: '*' }})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: JoinRoomPayload): void {
    const roomName = payload.chatroomId.toString();

    client.join(roomName)

    this.server.to(roomName).emit('message', {
      type: 'joinRoom',
      userId: payload.userId
    });
  }

  @Inject(ChatHistoryService)
  private chatHistoryService: ChatHistoryService

  @Inject(UserService)
  private userService: UserService
  
  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() payload: SendMessagePayload) {
    const roomName = payload.chatroomId.toString();

    const map = {
      text: 0,
      image: 1,
      file: 2,
    };

    let history = null;

    if (payload.message.numIndex == 1) {
      const res = await this.chatHistoryService.updata(payload.message);
      if (typeof res != 'string') {
        for (let i = 0; i < res.length; i++) {
          const sender = await this.userService.findUserDetailById(
            res[i].senderId,
          );

          this.server.to(roomName).emit('message', {
            type: 'sendMessage',
            userId: payload.sendUserId,
            message: {
              ...res[i],
              sender,
            },
          });
        }
      }
      return;
    } else {
      history = await this.chatHistoryService.add(payload.chatroomId, {
        content: payload.message.content,
        type: map[payload.message.type],
        chatroomId: payload.chatroomId,
        senderId: payload.sendUserId,
        name: payload.message.name,
        size: payload.message.size,
        district: payload.message.district,
        weight: payload.message.weight,
      });
    }


    // const history = await this.chatHistoryService.add(payload.chatroomId, {
    //   content: payload.message.content,
    //   type: map[payload.message.type],
    //   chatroomId: payload.chatroomId,
    //   senderId: payload.sendUserId,
    //   name: payload.message.name,
    //   size: payload.message.size,
    //   district: payload.message.district,
    //   weight: payload.message.weight,
    // });
    const sender = await this.userService.findUserDetailById(history.senderId);

    this.server.to(roomName).emit('message', {
      type: 'sendMessage',
      userId: payload.sendUserId,
      message: {
        ...history,
        sender,
      },
    });
  }
}
