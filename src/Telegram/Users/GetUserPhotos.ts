// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import bigInt from 'big-integer';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
export interface getUserPhotosMoreParams {
  offset?: number;
  maxId?: bigint;
  limit?: number;
}
/**
 * Getting all user profile photos.
 * @param telestaticClient - Client
 * @param {number|string|bigint} userId - id of user.
 * @param {Object} more - more object for getUserPhotos
 * ```ts
 * bot.command("getUserPhotos",async (ctx)=>{
 *     let results = await ctx.telegram.getUserPhotos(ctx.from.id)
 *     console.log(results)
 * })
 * ```
 */
export async function GetUserPhotos(
  telestaticClient: Telestatic,
  userId: number | string | bigint,
  more?: getUserPhotosMoreParams
) {
  try {
    telestaticClient.log.debug('Running telegram.getUserPhotos');
    let [id, type, peer] = await toBigInt(userId, telestaticClient);
    let results: Api.photos.TypePhotos = await telestaticClient.client.invoke(
      new Api.photos.GetUserPhotos({
        userId: peer,
        offset: more ? more.offset : undefined,
        maxId: more ? bigInt(String(more.maxId)) : undefined,
        limit: more ? more.limit : undefined,
      })
    );
    return results;
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.getUserPhotos');
    throw new BotError(
      error.message,
      'telegram.getUserPhotos',
      `${userId}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
