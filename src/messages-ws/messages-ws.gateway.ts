import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { newMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService : JwtService
    ) {}


  async handleConnection(client: Socket) {
    // console.log('Client connected: ' + client.id);
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return ;
    }
    // console.log(payload);

    
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }
  handleDisconnect(client: any) {
    // console.log('Client disconnected: ' + client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: newMessageDto): void {
    // Enviar mensajes a todos los clientes conectados
    // this.wss.emit('message-from-server', {
    //   message: payload.message ,
    //   fullName: client.id
    // });
    console.log({message: payload.message , fullName: this.messagesWsService.getUserFullName(client.id)});
    // Enviar mensajes a todos los clientes conectados excepto al que envió el mensaje
    // client.broadcast.emit('message-from-server', {
    //   message: payload.message ,
    //   fullName: this.messagesWsService.getUserFullName(client.id)
    // });

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    });
  }
}
