// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telestatic } from '../../Client';
import { ResultGetEntity } from '../Users/GetEntity';
import { Api } from 'telegram';
import BotError from '../../Context/Error';
import bigInt from 'big-integer';
/**
 * Get the number of members in a chat.
 * @param telestaticClient - client
 * @param {number|string|bigint} chatId - Chat or channels id to getting the number of members.
 * ```ts
 * bot.command("getChatMembersCount",async (ctx) => {
 *     let results = await ctx.telegram.getChatMembersCount(ctx.chat.id)
 *     console.log(results)
 * })
 * ```
 */
export async function GetChatMembersCount(telestaticClient: Telestatic, chatId: number | string | bigint) {
  try {
    telestaticClient.log.debug('Running telegram.getChatMembersCount');
    let chat = await telestaticClient.telegram.getEntity(chatId, true);
    if (chat.type === 'user') {
      throw new Error('Typeof chatId must be channel or chat, not a user.');
    }
    if (chat.participantsCount && chat.participantsCount !== null) {
      return chat.participantsCount;
    }
    if (chat.type == 'chat') {
      let r = await telestaticClient.client.invoke(
        new Api.messages.GetChats({
          id: [bigInt(chat.id!)],
        })
      );
      let s: Api.Chat = r.chats[0] as Api.Chat;
      telestaticClient.entityCache.set(chat.id, await new ResultGetEntity().init(s!, telestaticClient));
      return s.participantsCount;
    }
    if (chat.type == 'channel' || chat.type == 'supergroup') {
      let r: Api.messages.ChatFull = await telestaticClient.client.invoke(
        new Api.channels.GetFullChannel({
          channel: bigInt(chat.id!),
        })
      );
      let fc: Api.ChannelFull = r.fullChat as Api.ChannelFull;
      let s: Api.Channel = r.chats[0] as Api.Channel;
      s.participantsCount = fc.participantsCount;
      telestaticClient.entityCache.set(chat.id, await new ResultGetEntity().init(s, telestaticClient));
      return s.participantsCount;
    }
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.getChatMembersCount');
    throw new BotError(error.message, 'telegram.getChatMembersCount', `${chatId}`);
  }
}
