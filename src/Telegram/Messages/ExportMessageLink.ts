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
export interface exportMessageLinkMoreParams {
  thread?: boolean;
  grouped?: boolean;
}
/**
 * Get link and embed info of a message in a channel/supergroup
 * @param telestaticClient - client
 * @param {number|string|bigint} chatId - supergroup/channel id.
 * @param {number} messageId - message id.
 * @param {Object} more - more paramaters to use.
 */
export async function ExportMessageLink(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  messageId: number,
  more?: exportMessageLinkMoreParams
) {
  try {
    telestaticClient.log.debug('Running telegram.exportMessageLink');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let [id, type, peer] = await toBigInt(chatId, telestaticClient);
    return telestaticClient.client.invoke(
      new Api.channels.ExportMessageLink({
        channel: peer,
        id: messageId,
        ...more,
      })
    );
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.exportMessageLink');
    throw new BotError(
      error.message,
      'telegram.exportMessageLink',
      `${chatId},${messageId}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
