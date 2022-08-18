// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Update } from './Update';
import { From } from '../Utils/From';
import { Telegram } from '../Telegram';
import { Telestatic } from '../Client';
import { toString } from '../Utils/ToBigInt';

export class UpdateUserName extends Update {
  user!: From;
  constructor() {
    super();
    this['_'] = 'updateUserName';
  }
  async init(update: Api.UpdateUserName, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.telegram = TelestaticClient.telegram;
    if (update.userId) {
      let user = new From();
      await user.init(BigInt(toString(update.userId!) as string), TelestaticClient);
      this.user = user;
    }
  }
}
