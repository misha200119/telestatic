// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import { ResultAffectedMessages } from './DeleteMessages';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
/**
 * Mark mentions as read.
 * @param telestaticClient - client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * ```ts
 * bot.command("readMentions",async (ctx)=>{
 *     let results = await ctx.telegram.readMentions(ctx.chat.id)
 *     console.log(results)
 * })
 * ```
 */
export async function ReadMentions(telestaticClient: Telestatic, chatId: number | string | bigint) {
  try {
    telestaticClient.log.debug('Running telegram.readMentions');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let [id, type, peer] = await toBigInt(chatId, telestaticClient);
    return new ResultAffectedMessages(
      await telestaticClient.client.invoke(
        new Api.messages.ReadMentions({
          peer: peer,
        })
      )
    );
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.readMentions');
    throw new BotError(error.message, 'telegram.readMentions', '');
  }
}
