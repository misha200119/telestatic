// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Update } from './Update';
import { Api } from 'telegram';
import { Telestatic } from '../Client';
import { Telegram } from '../Telegram';
import Parser, { Entities } from '@tgsnake/parser';
import { ForwardMessage } from '../Utils/ForwardMessage';
import { From } from '../Utils/From';
import { Chat } from '../Utils/Chat';
import { MessageContext } from '../Context/MessageContext';
import { toString } from '../Utils/ToBigInt';
const parser = new Parser(Api);
export class UpdateShortMessage extends Update {
  message!: MessageContext;
  constructor() {
    super();
    this['_'] = 'updateShortMessage';
  }
  async init(update: Api.UpdateShortMessage, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.message = new MessageContext();
    this.telegram = TelestaticClient.telegram;
    this.message.out = update.out;
    this.message.mentioned = update.mentioned;
    this.message.mediaUnread = update.mediaUnread;
    this.message.silent = update.silent;
    this.message.id = update.id;
    this.message.text = update.message;
    this.message.date = update.date;
    this.message.ttlPeriod = update.ttlPeriod;
    this.message.viaBotId = BigInt(toString(update.viaBotId!) as string);
    this.message.TelestaticClient = TelestaticClient;
    if (update.userId) {
      let chat = new Chat();
      let from = new From();
      await chat.init(BigInt(toString(update.userId!) as string), TelestaticClient);
      if (!update.out) {
        await from.init(BigInt(toString(update.userId!) as string), TelestaticClient);
      } else {
        await from.init(TelestaticClient.aboutMe.id, TelestaticClient);
      }
      this.message.chat = chat;
      this.message.from = from;
    }
    if (update.replyTo) {
      this.TelestaticClient.log.debug(`Creating replyToMessage`);
      let replyTo = await this.TelestaticClient.telegram.getMessages(
        this.message.chat.id,
        [update.replyTo.replyToMsgId],
        false
      );
      this.message.replyToMessage = replyTo.messages[0];
    }
    if (update.fwdFrom) {
      let fwd = new ForwardMessage();
      await fwd.init(update.fwdFrom, TelestaticClient);
      this.message.fwdFrom = fwd;
    }
    if (update.entities) {
      this.message.entities = parser.fromRaw(update.entities);
    }
    return this;
  }
}
