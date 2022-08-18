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
import * as Medias from '../../Utils/Medias';
import BotError from '../../Context/Error';
import bigInt from 'big-integer';

export interface InterfaceLocation {
  latitude: number;
  longitude: number;
  accuracyRadius?: number;
}
/**
 * Sending Location
 * @param telestaticClient - Client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * @param {Object} location - location
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("loc",async (ctx) => {
 *     let results = await ctx.telegram.sendLocation(ctx.chat.id,{
 *    latitude : 0,
 *    longitude : 0
 *  })
 * })
 * ```
 */
export async function SendLocation(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  location: InterfaceLocation | Medias.MediaLocation,
  more?: defaultSendMediaMoreParams
) {
  try {
    telestaticClient.log.debug('Running telegram.sendLocation');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    return await SendMedia(
      telestaticClient,
      chatId,
      new Api.InputMediaGeoPoint({
        geoPoint: new Api.InputGeoPoint({
          lat: location.latitude,
          long: location.longitude,
          accuracyRadius: location.accuracyRadius,
        }),
      }),
      more
    );
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.sendLocation');
    throw new BotError(
      error.message,
      'telegram.sendLocation',
      `${chatId},${JSON.stringify(location)}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
