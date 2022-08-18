// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telestatic } from '../../Client';
import { Api } from 'telegram';
import BotError from '../../Context/Error';
import * as Updates from '../../Update';
import bigInt, { BigInteger } from 'big-integer';
import { convertId } from '../../Utils/ToBigInt';

export interface editAdminMoreParams {
  changeInfo?: boolean;
  postMessages?: boolean;
  editMessages?: boolean;
  deleteMessages?: boolean;
  banUsers?: boolean;
  inviteUsers?: boolean;
  pinMessages?: boolean;
  addAdmins?: boolean;
  anonymous?: boolean;
  manageCall?: boolean;
  rank?: string;
}
/**
 * Modify the admin rights of a user in a supergroup/channel.
 * @param telestaticClient - Client
 * @param {bigint|number|string} chatId - Chat/Channel/Group id.
 * @param {bigint|number|string} userId - User id.
 * @param {Object} - more parameters to use.
 *```ts
 * bot.command("promote",async (ctx) => {
 *    if((!ctx.chat.private) && ctx.replyToMessage){
 *        let results = await ctx.telegram.editAdmin(ctx.chat.id,ctx.replyToMessage.from.id)
 *        console.log(results)
 *    }
 * })
 *```
 * This method will return UpdateNewMessage or UpdateNewChannelMessage if success.
 */
export async function EditAdmin(
  telestaticClient: Telestatic,
  chatId: bigint | number | string,
  userId: bigint | number | string,
  more?: editAdminMoreParams
) {
  try {
    telestaticClient.log.debug('Running telegram.editAdmin');
    if (typeof userId === 'number')
      telestaticClient.log.warning(
        'Type of userId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let results: Api.TypeUpdates = await telestaticClient.client.invoke(
      new Api.channels.EditAdmin({
        channel: convertId(chatId),
        userId: convertId(userId),
        adminRights: new Api.ChatAdminRights(
          Object.assign(
            {
              changeInfo: true,
              postMessages: true,
              editMessages: true,
              deleteMessages: true,
              banUsers: true,
              inviteUsers: true,
              pinMessages: true,
              addAdmins: false,
              anonymous: false,
              manageCall: true,
            },
            more
          )
        ),
        rank: more?.rank || '',
      })
    );
    telestaticClient.log.debug('Creating results telegram.editAdmin');
    return await generateResults(results, telestaticClient);
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.editAdmin');
    throw new BotError(
      error.message,
      'telegram.editAdmin',
      `${chatId},${userId}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
async function generateResults(results: Api.TypeUpdates, TelestaticClient: Telestatic) {
  if (results instanceof Api.Updates) {
    results as Api.Updates;
    if (results.updates.length > 0) {
      for (let i = 0; i < results.updates.length; i++) {
        let update = results.updates[i];
        if (update instanceof Api.UpdateNewMessage) {
          update as Api.UpdateNewMessage;
          let res = new Updates.UpdateNewMessage();
          await res.init(update, TelestaticClient);
          return res;
        }
        if (update instanceof Api.UpdateNewChannelMessage) {
          update as Api.UpdateNewChannelMessage;
          let res = new Updates.UpdateNewChannelMessage();
          await res.init(update, TelestaticClient);
          return res;
        }
      }
    }
  }
}
