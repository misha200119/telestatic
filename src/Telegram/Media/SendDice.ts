// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import { SendMedia, defaultSendMediaMoreParams } from './SendMedia';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import * as Medias from '../../Utils/Medias';
import BotError from '../../Context/Error';
/**
 * Sending Dice
 * @param telestaticClient - Client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * @param {string|Object} dice - dice emoticon .
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("dice",async (ctx) => {
 *     let results = await ctx.telegram.sendDice(ctx.chat.id,"🎯")
 * })
 * ```
 */
export async function SendDice(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  dice: string | Medias.MediaDice,
  more?: defaultSendMediaMoreParams
) {
  try {
    telestaticClient.log.debug('Running telegram.sendDice');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    //@ts-ignore
    let emoji = typeof dice == 'string' ? dice : dice.emoji;
    return await SendMedia(
      telestaticClient,
      chatId,
      new Api.InputMediaDice({
        emoticon: emoji,
      }),
      more!
    );
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.sendDice');
    throw new BotError(
      error.message,
      'telegram.sendDice',
      `${chatId},${dice}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
