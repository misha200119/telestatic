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
import { BigInteger } from 'big-integer';
import { toString } from '../Utils/ToBigInt';
export class UpdateMessageID extends Update {
  id!: number;
  randomId!: bigint;
  constructor() {
    super();
    this['_'] = 'updateMessageID';
  }
  async init(update: Api.UpdateMessageID, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.telegram = TelestaticClient.telegram;
    this.id = update.id;
    this.randomId = BigInt(toString(update.randomId!) as string);
    return this;
  }
}
