// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import BotError from '../../Context/Error';
/**
 * Get a list of channels/supergroups we left.
 * @param telestaticClient - Client.
 * @param {number} offset - offset of pagination.
 * ```ts
 * bot.command("getLeftChannels",async (ctx) => {
 *     let results = await ctx.telegram.getLeftChannels()
 *     console.log(results)
 * })
 * ```
 */
export async function GetLeftChannels(telestaticClient: Telestatic, offset: number = 0) {
  try {
    telestaticClient.log.debug('Running telegram.getLeftChannels');
    return await telestaticClient.client.invoke(
      new Api.channels.GetLeftChannels({
        offset: offset,
      })
    );
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.getLeftChannels');
    throw new BotError(error.message, 'telegram.getLeftChannels', `${offset}`);
  }
}
