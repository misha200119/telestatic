// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { From } from '../Utils/From';
import { Update } from './Update';
import { Telegram } from '../Telegram';
import { Telestatic } from '../Client';
import { BigInteger } from 'big-integer';
import { MessageContext } from '../Context/MessageContext';
import Util from 'tg-file-id/dist/Util';
import { toString } from '../Utils/ToBigInt';
export class UpdateBotCallbackQuery extends Update {
  id!: bigint;
  data?: string;
  message?: MessageContext;
  from!: From;
  chatInstance!: bigint;
  inlineMessageId?: string;
  gameShortName?: string;
  constructor() {
    super();
    this['_'] = 'updateBotCallbackQuery';
  }
  async init(update: Api.UpdateBotCallbackQuery, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.telegram = TelestaticClient.telegram;
    this.data = update.data?.toString('utf8');
    this.id = BigInt(toString(update.queryId!) as string);
    this.gameShortName = update.gameShortName;
    this.chatInstance = BigInt(toString(update.chatInstance) as string);
    this.message = new MessageContext();
    if (update.peer instanceof Api.PeerChat) {
      update.peer as Api.PeerChat;
      let msg = await TelestaticClient.telegram.getMessages(
        BigInt(`-${toString(update.peer.chatId!)}` as string),
        [update.msgId]
      );
      this.message = msg.messages[0];
    }
    if (update.peer instanceof Api.PeerChannel) {
      update.peer as Api.PeerChannel;
      let msg = await TelestaticClient.telegram.getMessages(
        BigInt(`-100${toString(update.peer.channelId!)}` as string),
        [update.msgId]
      );
      this.message = msg.messages[0];
    }
    if (update.peer instanceof Api.PeerUser) {
      update.peer as Api.PeerUser;
      let msg = await TelestaticClient.telegram.getMessages(
        BigInt(toString(update.peer.userId!) as string),
        [update.msgId]
      );
      this.message = msg.messages[0];
    }
    this.from = new From();
    await this.from.init(BigInt(toString(update.userId!) as string), TelestaticClient);
    return this;
  }
}
