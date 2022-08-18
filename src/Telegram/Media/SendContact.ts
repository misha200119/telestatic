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
export interface InterfaceContact {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vcard: string;
}
/**
 * Sending Contact
 * @param telestaticClient - Client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * @param {Object} contact - contact.
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("contact",async (ctx) => {
 *     let results = await ctx.telegram.sendContact(ctx.chat.id,{
 *    firstName : "someone",
 *    lastName : "",
 *    phoneNumber : "1234567890",
 *    vcard : "something info"
 *  })
 * })
 * ```
 */
export async function SendContact(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  contact: InterfaceContact | Medias.MediaContact,
  more?: defaultSendMediaMoreParams
) {
  try {
    telestaticClient.log.debug('Running telegram.sendContact');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    //@ts-ignore
    let emoji = typeof dice == 'string' ? dice : dice.emoji;
    return await SendMedia(
      telestaticClient,
      chatId,
      new Api.InputMediaContact({
        firstName: contact.firstName,
        lastName: contact.lastName ?? '',
        phoneNumber: contact.phoneNumber,
        vcard: contact.vcard,
      }),
      more!
    );
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.sendContact');
    throw new BotError(
      error.message,
      'telegram.sendContact',
      `${chatId},${JSON.stringify(contact)}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
