// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
// 
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published..

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import { TypeReplyMarkup, BuildReplyMarkup } from '../../Utils/ReplyMarkup';
import Parser, { Entities } from '@tgsnake/parser';
import bigInt from 'big-integer';
import * as Update from '../../Update';
import { toBigInt, toString } from '../../Utils/ToBigInt';
import BotError from '../../Context/Error';
const parser = new Parser(Api);
export interface sendMessageMoreParams {
  noWebpage?: boolean;
  silent?: boolean;
  background?: boolean;
  parseMode?: string;
  clearDraft?: boolean;
  replyToMsgId?: number;
  replyMarkup?: TypeReplyMarkup;
  entities?: Entities[];
  scheduleDate?: number;
  noforwards?: boolean;
  sendAs?: string;
}
export async function sendMessage(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  text: string,
  more?: sendMessageMoreParams
) {
  try {
    telestaticClient.log.debug('Running telegram.sendMessage');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    let parseMode = '';
    let replyMarkup;
    let parseText = text;
    let entities: Api.TypeMessageEntity[] = [];
    let [id, type, peer] = await toBigInt(chatId, telestaticClient);
    if (more) {
      if (more.parseMode) {
        parseMode = more.parseMode.toLowerCase();
        delete more.parseMode;
      }
      if (more.replyMarkup) {
        telestaticClient.log.debug('Building replyMarkup');
        replyMarkup = await BuildReplyMarkup(more.replyMarkup!, telestaticClient);
        delete more.replyMarkup;
      }
      if (more.entities) {
        telestaticClient.log.debug('Building Entities');
        entities = (await parser.toRaw(
          telestaticClient.client!,
          more.entities!
        )) as Array<Api.TypeMessageEntity>;
      }
    }
    if (!more?.entities) {
      telestaticClient.log.debug('Building Entities');
      //@ts-ignore
      let [t, e] = parseMode !== '' ? parser.parse(text, parseMode) : [text, []];
      parseText = t;
      entities = (await parser.toRaw(telestaticClient.client!, e!)) as Array<Api.TypeMessageEntity>;
    }
    let results: Api.TypeUpdates = await telestaticClient.client.invoke(
      new Api.messages.SendMessage({
        peer: peer,
        message: parseText,
        randomId: bigInt(-Math.floor(Math.random() * 10000000000000)),
        //@ts-ignore
        entities: entities,
        replyMarkup: replyMarkup,
        ...more,
      })
    );
    return await createResults(results, telestaticClient);
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.sendMessage');
    throw new BotError(
      error.message,
      'telegram.sendMessage',
      `${chatId},${text},${more ? JSON.stringify(more, null, 2) : ''}`
    );
  }
}
async function createResults(results: Api.TypeUpdates, telestaticClient: Telestatic) {
  telestaticClient.log.debug('Creating results telegram.sendMessage');
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
