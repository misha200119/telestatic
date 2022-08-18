// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import Parser, { Entities } from '@tgsnake/parser';
import BigInt from 'big-integer';
import * as Update from '../../Update';
import path from 'path';
import { toBigInt, toString, convertId } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
import { onProgress } from './UploadFile';
const parser = new Parser(Api);
export interface defaultSendMediaMoreParams {
  silent?: boolean;
  background?: boolean;
  clearDraft?: boolean;
  replyToMsgId?: number;
  scheduleDate?: number;
  noforwards?: boolean;
  sendAs?: string;
  replyMarkup?: TypeReplyMarkup;
}
export interface sendMediaMoreParams extends defaultSendMediaMoreParams {
  entities?: Entities[];
  parseMode?: string;
  caption?: string;
}
/**
 * Sending message media.
 * @param telestaticClient - Client
 * @param {number|string|bigint} chatId - Chat/Groups/Channel id.
 * @param {Object} media - Message Media.
 * @param more - more parameters to use.
 */
export async function SendMedia(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  media: Api.TypeInputMedia,
  more?: sendMediaMoreParams
) {
  try {
    telestaticClient.log.debug('Running telegram.sendMedia');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let parseMode = '';
    let [id, type, peer] = await toBigInt(chatId, telestaticClient);
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
    }
    let parseText;
    let entities: Api.TypeMessageEntity[] = [];
    let replyMarkup;
    if (more) {
      if (more.entities) {
        telestaticClient.log.debug('Building Entities');
        entities = (await parser.toRaw(
          telestaticClient.client!,
          more.entities
        )) as Array<Api.TypeMessageEntity>;
        parseText = more.caption || '';
        delete more.entities;
      }
      if (more.caption && !more.entities) {
        telestaticClient.log.debug('Building Entities');
        //@ts-ignore
        let [t, e] = parseMode !== '' ? parser.parse(more.caption, parseMode!) : [more.caption, []];
        parseText = t;
        entities = (await parser.toRaw(telestaticClient.client!, e!)) as Array<Api.TypeMessageEntity>;
        delete more.caption;
      }
      if (more.replyMarkup) {
        telestaticClient.log.debug('Building replyMarkup');
        replyMarkup = await BuildReplyMarkup(more.replyMarkup!, telestaticClient);
        delete more.replyMarkup;
      }
    }
    return await createResults(
      await telestaticClient.client.invoke(
        new Api.messages.SendMedia({
          peer: peer,
          media: media,
          message: parseText || '',
          randomId: BigInt(-Math.floor(Math.random() * 10000000000000)),
          //@ts-ignore
          entities: entities,
          replyMarkup: replyMarkup,
          ...more,
        })
      ),
      telestaticClient
    );
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.sendMedia');
    throw new BotError(
      error.message,
      'telegram.sendMedia',
      `${chatId},${JSON.stringify(media)}${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
async function createResults(results: Api.TypeUpdates, telestaticClient: Telestatic) {
  telestaticClient.log.debug('Creating results telegram.sendMedia');
  if (results instanceof Api.UpdateShortSentMessage) {
    results as Api.UpdateShortSentMessage;
    let update = new Update.UpdateShortSentMessage();
    await update.init(results, telestaticClient);
    return update;
  }
  if (results instanceof Api.Updates) {
    results as Api.Updates;
    if (results.updates.length > 0) {
      for (let i = 0; i < results.updates.length; i++) {
        if (results.updates[i] instanceof Api.UpdateNewMessage) {
          let arc = results.updates[i] as Api.UpdateNewMessage;
          let update = new Update.UpdateNewMessage();
          await update.init(arc, telestaticClient);
          return update;
        }
        if (results.updates[i] instanceof Api.UpdateNewChannelMessage) {
          let arc = results.updates[i] as Api.UpdateNewChannelMessage;
          let update = new Update.UpdateNewChannelMessage();
          await update.init(arc, telestaticClient);
          return update;
        }
      }
    }
  }
}
