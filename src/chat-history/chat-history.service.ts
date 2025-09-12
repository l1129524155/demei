import { Inject, Injectable } from '@nestjs/common';
import { ChatHistory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export type HistoryDto = Pick<ChatHistory, 'chatroomId' | 'senderId' | 'type' | 'content' | 'name' | 'size' | 'district' | 'weight' >;

@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(chatroomId: number) {
    const history = await this.prismaService.chatHistory.findMany({
      where: {
        chatroomId,
      },
      skip: 0,
      take: 20,
      orderBy: {
        createTime: 'desc'
      },
    });

    const res = [];
    for(let i = 0; i < history.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: history[i].senderId
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true,
          createTime: true,
          headPic: true,
        },
   });
      res.push({
        ...history[i],
        sender: user,
      });
    }
    return res;
 }

    async add(chatroomId: number, history: HistoryDto) {
        return this.prismaService.chatHistory.create({
            data: history
        });
    }

  async updata(historys) {
    const arr = [];
    let foundHistory = null;

    for (let i = 0; i < historys.weights.length; i++) {
      foundHistory = await this.prismaService.chatHistory.findUnique({
        where: {
          id: +historys.weights[i].id,
        },
      });
      foundHistory.weight = +historys.weights[i].num;
      try {
        const newVal = await this.prismaService.chatHistory.update({
          where: {
            id: +historys.weights[i].id,
          },
          data: foundHistory,
        });
        arr.push(newVal);
      } catch (e) {
        // console.log('222', e)
        // this.logger.error(e, UserService);
        return '用户信息修改失败,请重新操作';
      }
      // console.log(arr, 'kkkkkk')
    }
    return arr

    // const foundHistory = await this.prismaService.chatHistory.findUnique({
    //   where: {
    //     id: history.id
    //   },
    // });

    // if(history.weight){
    //   foundHistory.weight = history.weight;
    // }

    // try {
    // let res = await this.prismaService.chatHistory.update({
    //     where: {
    //       id: history.id
    //     },
    //     data: foundHistory
    // });
    //   return res;
    // } catch (e) {
    //   // this.logger.error(e, UserService);
    //   return '用户信息修改失败,请重新操作';
    // }
  }
}
