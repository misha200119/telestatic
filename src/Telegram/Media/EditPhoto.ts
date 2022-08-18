// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import { UploadFile } from './UploadFile';
import * as Updates from '../../Update';
import { toBigInt, toString, convertId } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
import bigInt, { BigInteger } from 'big-integer';
/**
 * Change the profile picture of chat.
 * @param telestaticClient - Client
 * @param {number|string|bigint} chatId - Chat/Groups/Channel which will change the profile picture.
 * @param {string|Buffer} photo - The location where the file is located/Url/The buffer of the file.
 * ```ts
 * bot.command("editPhoto", async (ctx)=>{
 *     if(!ctx.chat.private){
 *         let results = await ctx.telegram.editPhoto(ctx.chat.id,"https://telestatic.js.org/images/telestatic.jpg")
 *         console.log(results)
 *     }
 * })
 * ```
 */
export async function EditPhoto(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  photo: string | Buffer
) {
  try {
    telestaticClient.log.debug('Running telegram.editPhoto');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let rr = await UploadFile(telestaticClient, photo);
    let [id, type, peer] = await toBigInt(chatId, telestaticClient);
    if (type == 'channel' || type == 'supergroup') {
      let results: Api.TypeUpdates = await telestaticClient.client.invoke(
        new Api.channels.EditPhoto({
          channel: id as BigInteger,
          photo: new Api.InputChatUploadedPhoto({
            file: rr!,
          }),
        })
      );
      return await generateResults(results, telestaticClient);
    } else {
      return telestaticClient.client.invoke(
        new Api.messages.EditChatPhoto({
          chatId: id as BigInteger,
          photo: new Api.InputChatUploadedPhoto({
            file: rr!,
          }),
        })
      );
    }
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.editPhoto');
    throw new BotError(
      error.message,
      'telegram.editPhoto',
      `${chatId}${Buffer.isBuffer(photo) ? `<Buffer ${photo.toString('hex')} >` : photo}`
    );
  }
}
async function generateResults(results: Api.TypeUpdates, TelestaticClient: Telestatic) {
  TelestaticClient.log.debug('Creating results telegram.editPhoto');
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
