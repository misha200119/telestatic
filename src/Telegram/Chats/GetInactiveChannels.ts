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
 * Get inactive channels and supergroups.
 * @param telestaticClient - Client
 * ```ts
 * bot.command("getInactiveChannels",async (ctx) => {
 *     let results = await ctx.telegram.getInactiveChannels()
 *     console.log(results)
 * })
 * ```
 */
export async function GetInactiveChannels(telestaticClient: Telestatic) {
  try {
    telestaticClient.log.debug('Running telegram.getInactiveChannels');
    return await telestaticClient.client.invoke(new Api.channels.GetInactiveChannels());
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.getInactiveChannels');
    throw new BotError(error.message, 'telegram.getInactiveChannels', '');
  }
}
