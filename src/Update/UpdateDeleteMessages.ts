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

export class UpdateDeleteMessages extends Update {
  id!: number[];
  constructor() {
    super();
    this['_'] = 'updateDeleteMessages';
  }
  async init(update: Api.UpdateDeleteMessages, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.telegram = TelestaticClient.telegram;
    this.id = update.messages;
    return this;
  }
}
