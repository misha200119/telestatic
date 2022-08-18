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
import { PaymentRequestedInfo } from '../Utils/Payment';
export class UpdateBotPrecheckoutQuery extends Update {
  id!: bigint;
  from!: From;
  payload!: string;
  info?: PaymentRequestedInfo;
  shippingOptionId?: string;
  currency!: string;
  totalAmount!: bigint;
  constructor() {
    super();
    this['_'] = 'updateBotPrecheckoutQuery';
  }
  async init(update: Api.UpdateBotPrecheckoutQuery, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.telegram = TelestaticClient.telegram;
    this.id = BigInt(String(update.queryId));
    this.payload = update.payload.toString('utf8');
    this.currency = update.currency;
    this.totalAmount = BigInt(String(update.totalAmount));
    this.shippingOptionId = update.shippingOptionId;
    this.from = new From();
    if (update.info) {
      this.info = new PaymentRequestedInfo(update.info!);
    }
    await this.from.init(BigInt(String(update.userId)), TelestaticClient);
    return this;
  }
  async answer(ok: boolean, error?: string) {
    return this.telegram.answerPrecheckoutQuery(this.id, ok, error);
  }
}
