// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telestatic } from '../../Client';
import { Api } from 'telegram';
import * as Updates from '../../Update';
import BotError from '../../Context/Error';
import { convertId, toBigInt } from '../../Utils/ToBigInt';
import { BigInteger } from 'big-integer';
/**
 * edit chat/group/channel title.
 * @param telestaticClient - Client
 * @param {bigint|number|string} chatId - Chat/Groups/Channel id.
 * @param {string} title - New title.
 * ```ts
 * bot.command("editTitle",async (ctx) => {
 *    if(!ctx.chat.private){
 *        let results = await ctx.telegram.editTitle(ctx.chat.id,"hey new title")
 *        console.log(results)
 *    }
 * })
 * ```
 * This method will return UpdateNewMessage or UpdateNewChannelMessage. if success.
 */
export async function EditTitle(
  telestaticClient: Telestatic,
  chatId: bigint | number | string,
  title: string
) {
  try {
    telestaticClient.log.debug('Running telegram.editTitle');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let [id, type] = await toBigInt(chatId, telestaticClient);
    if (type == 'channel') {
      let results: Api.TypeUpdates = await telestaticClient.client.invoke(
        new Api.channels.EditTitle({
          channel: id as BigInteger,
          title: title,
        })
      );
      telestaticClient.log.debug('Creating results telegram.editTitle');
      return await generateResults(results, telestaticClient);
    } else {
      return telestaticClient.client.invoke(
        new Api.messages.EditChatTitle({
          chatId: id as BigInteger,
          title: title,
        })
      );
    }
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.editTitle');
    throw new BotError(error.message, 'telegram.editTitle', `${chatId},${title}`);
  }
}
async function generateResults(results: Api.TypeUpdates, TelestaticClient: Telestatic) {
  if (results instanceof Api.Updates) {
    results as Api.Updates;
    if (results.updates.length > 0) {
      for (let i = 0; i < results.updates.length; i++) {
        let update = results.updates[i];
        if (update instanceof Api.UpdateNewMessage) {
          update as Api.UpdateNewMessage;
          let res = new Updates.UpdateNewMessage();
          await res.init(update, TelestaticClient);
          return res;
        }
        if (update instanceof Api.UpdateNewChannelMessage) {
          update as Api.UpdateNewChannelMessage;
          let res = new Updates.UpdateNewChannelMessage();
          await res.init(update, TelestaticClient);
          return res;
        }
      }
    }
  }
}
