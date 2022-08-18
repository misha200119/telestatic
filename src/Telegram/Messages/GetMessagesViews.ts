// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export class ResultsMessagesViews {
  views?: Views[];
  date: Date | number = Math.floor(Date.now() / 1000);
  constructor(results: Api.messages.MessageViews) {
    if (results?.views.length > 0) {
      let tempViews: Views[] = new Array();
      for (let i = 0; i < results.views.length; i++) {
        let msg = results.views[i] as Api.MessageViews;
        tempViews.push(new Views(msg));
      }
      this.views = tempViews;
    }
  }
}
export class Views {
  views?: number;
  forwards?: number;
  replies?: Api.MessageReplies;
  constructor(getMessagesViews: Api.MessageViews) {
    if (getMessagesViews.views) {
      this.views = getMessagesViews.views;
    }
    if (getMessagesViews.forwards) {
      this.forwards = getMessagesViews.forwards;
    }
    if (getMessagesViews.replies) {
      this.replies = getMessagesViews.replies;
    }
  }
}
/**
 * Get and increase the view counter of a message sent or forwarded from a channel.
 * @param telestaticClient - Client
 * @param {number|string|bigint} chatId - Where the message was found.
 * @param {Array} messageId - IDs of message.
 * @param {boolean} increment - Whether to mark the message as viewed and increment the view counter
 * ```ts
 * bot.command("getMessagesViews",async (ctx)=>{
 *     let results = await ctx.telegram.getMessagesViews(ctx.chat.id,[ctx.id])
 *     console.log(results)
 * })
 * ```
 */
export async function GetMessagesViews(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  messageId: number[],
  increment: boolean = false
) {
  try {
    telestaticClient.log.debug('Running telegram.getMessagesViews');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let [id, type, peer] = await toBigInt(chatId, telestaticClient);
    return new ResultsMessagesViews(
      await telestaticClient.client.invoke(
        new Api.messages.GetMessagesViews({
          peer: peer,
          id: messageId,
          increment: increment,
        })
      )
    );
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.getMessagesViews');
    throw new BotError(
      error.message,
      'telegram.getMessagesViews',
      `${chatId},${JSON.stringify(messageId)},${increment}`
    );
  }
}
