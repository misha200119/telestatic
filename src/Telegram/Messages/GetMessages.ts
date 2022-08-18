// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import BigInt from 'big-integer';
import { MessageContext } from '../../Context/MessageContext';
import * as Update from '../../Update';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
/**
 * Returns the list of messages by their IDs.
 * @param telestaticClient - Client
 * @param {bigint|number|string} chatId - Chat/Groups/Channel id.
 * @param {Array} messageId - Message Id.
 * @param {boolean} replies - if `true` it will getting the nested reply. and will making floodwait.
 * ```ts
 *   bot.command("getMessages",async (ctx)=>{
 *       let results = await ctx.telegram.getMessages(ctx.chat.id,[ctx.id])
 *       console.log(results)
 *   })
 * ```
 */
export async function GetMessages(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  messageId: number[],
  replies: boolean = false
) {
  try {
    telestaticClient.log.debug('Running telegram.getMessages');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let messageIds: any = messageId;
    let [id, type, peer] = await toBigInt(chatId, telestaticClient);
    if (type == 'channel' || type == 'supergroup') {
      let results: Api.messages.TypeMessages = await telestaticClient.client.invoke(
        new Api.channels.GetMessages({
          channel: peer,
          id: messageIds,
        })
      );
      let final: ResultsGetMessage = new ResultsGetMessage();
      await final.init(results, telestaticClient, replies);
      return final;
    } else {
      let results: Api.messages.TypeMessages = await telestaticClient.client.invoke(
        new Api.messages.GetMessages({
          id: messageIds,
        })
      );
      let final: ResultsGetMessage = new ResultsGetMessage();
      await final.init(results, telestaticClient, replies);
      return final;
    }
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.getMessages');
    throw new BotError(
      error.message,
      'telegram.getMessages',
      `${chatId},${JSON.stringify(messageId)}`
    );
  }
}
export class ResultsGetMessage {
  messages!: MessageContext[];
  date: number | Date = Math.floor(Date.now() / 1000);
  constructor() {}
  async init(results: Api.messages.TypeMessages, TelestaticClient: Telestatic, replies: boolean = false) {
    TelestaticClient.log.debug('Creating results telegram.getMessages');
    let tempMessages: MessageContext[] = [];
    if (results instanceof Api.messages.ChannelMessages) {
      for (let i = 0; i < results.messages.length; i++) {
        let msg = results.messages[i] as Api.Message;
        if (!replies) {
          delete msg.replyTo;
        }
        let msgc = new MessageContext();
        await msgc.init(msg, TelestaticClient);
        tempMessages.push(msgc);
      }
    }
    if (results instanceof Api.messages.Messages) {
      for (let i = 0; i < results.messages.length; i++) {
        let msg = results.messages[i] as Api.Message;
        if (!replies) {
          delete msg.replyTo;
        }
        let msgc = new MessageContext();
        await msgc.init(msg, TelestaticClient);
        tempMessages.push(msgc);
      }
    }
    this.messages = tempMessages;
    return this;
  }
}
