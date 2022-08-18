// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telestatic } from '../../Client';
import { Api } from 'telegram';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export class ResultAffectedMessages {
  pts?: number = 0;
  ptsCount?: number = 0;
  offset?: number;
  date: Date | number = Math.floor(Date.now() / 1000);
  constructor(results: Api.messages.AffectedMessages | Api.messages.AffectedHistory | boolean) {
    if (results instanceof Api.messages.AffectedMessages) {
      if (results.pts) this.pts = results.pts;
      if (results.ptsCount) this.ptsCount = results.ptsCount;
    }
    if (results instanceof Api.messages.AffectedHistory) {
      if (results.pts) this.pts = results.pts;
      if (results.ptsCount) this.ptsCount = results.ptsCount;
      if (results.offset) this.offset = results.offset;
    }
  }
}
/**
 * This method allow you to deletes messages by their identifiers
 * @param telestaticClient - Client
 * @param {number|string|bigint} chatId - User or chat, where is the message located.
 * @param {Array} messageId - Message ID list which will be deleted.
 * ```ts
 * bot.command("delete", async (ctx) => {
 *     let results = await ctx.telegram.deleteMessages(ctx.chat.id,[ctx.id])
 *     return console.log(results)
 * })
 * ```
 */
export async function DeleteMessages(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  messageId: number[]
) {
  try {
    telestaticClient.log.debug('Running telegram.deleteMessages');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let [id, type, peer] = await toBigInt(chatId, telestaticClient);
    if (type == 'channel' || type == 'supergroup') {
      return new ResultAffectedMessages(
        await telestaticClient.client.invoke(
          new Api.channels.DeleteMessages({
            channel: peer,
            id: messageId,
          })
        )
      );
    } else {
      return new ResultAffectedMessages(
        await telestaticClient.client.invoke(
          new Api.messages.DeleteMessages({
            revoke: true,
            id: messageId,
          })
        )
      );
    }
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.deleteMessages');
    throw new BotError(
      error.message,
      'telegram.deleteMessages',
      `${chatId},${JSON.stringify(messageId)}`
    );
  }
}
