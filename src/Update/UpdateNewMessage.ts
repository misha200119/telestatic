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
export class UpdateNewMessage extends Update {
  message!: MessageContext;
  constructor() {
    super();
    this['_'] = 'updateNewMessage';
  }
  async init(update: Api.UpdateNewMessage, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.telegram = TelestaticClient.telegram;
    let message = new MessageContext();
    if (update.message instanceof Api.Message) {
      await message.init(update.message as Api.Message, TelestaticClient);
    }
    if (update.message instanceof Api.MessageService) {
      await message.init(update.message as Api.MessageService, TelestaticClient);
    }
    this.message = message;
    return this;
  }
}
