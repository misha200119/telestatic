// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import * as Updates from '../../Update';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export interface pinMessageMoreParams {
  silent?: boolean;
  unpin?: boolean;
  pmOneside?: boolean;
}
/**
 * Pin or unpin a message.
 * @param telestaticClient - Client
 * @param {number|string|bigint} chatId - where to pin or unpin the message.
 * @param {number} messageId - The message to pin or unpin
 * @param {Object} more - more parameter for PinMessage
 * ```ts
 * bot.command("pin",async (ctx)=>{
 *     let results = await ctx.telegram.pinMessage(ctx.chat.id,ctx.id)
 *     console.log(results)
 * })
 * // unpin a message
 * bot.command("unpin",async (ctx)=>{
 *     if(ctx.replyToMessage){
 *         let results = await ctx.telegram.unpinMessage(ctx.chat.id,ctx.replyToMessage.id)
 *         console.log(results)
 *     }
 * })
 * ```
 */
export async function PinMessage(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  messageId: number,
  more?: pinMessageMoreParams
) {
  try {
    telestaticClient.log.debug('Running telegram.pinMessage');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let [id, type, peer] = await toBigInt(chatId, telestaticClient);
    let results: Api.TypeUpdates = await telestaticClient.client.invoke(
      new Api.messages.UpdatePinnedMessage({
        peer: peer,
        id: messageId,
        ...more,
      })
    );
    return await generateResults(results, telestaticClient);
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.pinMessage');
    throw new BotError(
      error.message,
      'telegram.pinMessage',
      `${chatId},${messageId}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
async function generateResults(results: Api.TypeUpdates, TelestaticClient: Telestatic) {
  TelestaticClient.log.debug('Running telegram.pinMessage');
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
        if (update instanceof Api.UpdatePinnedMessages) {
          update as Api.UpdatePinnedMessages;
          //todo
          // using Updates.UpdatePinnedMessages
          return update;
        }
        if (update instanceof Api.UpdatePinnedChannelMessages) {
          update as Api.UpdatePinnedChannelMessages;
          //todo
          //using Updates.UpdatePinnedChannelMessage
          return update;
        }
      }
    }
  }
}
