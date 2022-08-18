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
import Util from 'tg-file-id/dist/Util';
import { toString } from '../Utils/ToBigInt';
import { PostAddress } from '../Utils/Payment';
import { ShippingOptions } from '../Telegram/Bots';
export class UpdateBotShippingQuery extends Update {
  id!: bigint;
  from!: From;
  payload!: string;
  shippingAddress!: PostAddress;
  constructor() {
    super();
    this['_'] = 'updateBotShippingQuery';
  }
  async init(update: Api.UpdateBotShippingQuery, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.telegram = TelestaticClient.telegram;
    this.id = BigInt(String(update.queryId));
    this.payload = update.payload.toString('utf8');
    this.shippingAddress = new PostAddress(update.shippingAddress!);
    this.from = new From();
    await this.from.init(BigInt(String(update.userId)), TelestaticClient);
    return this;
  }
  async answer(options?: Array<ShippingOptions>, error?: string) {
    return this.telegram.answerShippingQuery(this.id, options, error);
  }
}
