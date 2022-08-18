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
import { MessageContext } from '../Context/MessageContext';
import { toString } from '../Utils/ToBigInt';

export class UpdateNewChannelMessage extends Update {
  message!: MessageContext;
  constructor() {
    super();
    this['_'] = 'updateNewChannelMessage';
  }
  async init(update: Api.UpdateNewChannelMessage, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.telegram = TelestaticClient.telegram;
    this.message = new MessageContext();
    if (update.message instanceof Api.Message) {
      await this.message.init(update.message as Api.Message, TelestaticClient);
      return this;
    }
    if (update.message instanceof Api.MessageService) {
      await this.message.init(update.message as Api.MessageService, TelestaticClient);
      return this;
    }
    return this;
  }
}
