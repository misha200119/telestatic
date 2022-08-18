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
export class UpdateInlineBotCallbackQuery extends Update {
  id!: bigint;
  data?: string;
  message?: MessageContext;
  from!: From;
  chatInstance!: bigint;
  inlineMessageId?: string;
  gameShortName?: string;
  constructor() {
    super();
    this['_'] = 'updateInlineBotCallbackQuery';
  }
  async init(update: Api.UpdateInlineBotCallbackQuery, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.telegram = TelestaticClient.telegram;
    this.data = update.data?.toString('utf8');
    this.id = BigInt(toString(update.queryId!) as string);
    this.gameShortName = update.gameShortName;
    this.chatInstance = BigInt(toString(update.chatInstance) as string);
    this.inlineMessageId = '';
    this.inlineMessageId += Util.to32bitBuffer(update.msgId.dcId);
    let id = BigInt(String(update.msgId.id));
    let accessHash = BigInt(String(update.msgId.accessHash));
    this.inlineMessageId += Util.to64bitBuffer(accessHash);
    this.inlineMessageId += Util.to64bitBuffer(id);
    this.inlineMessageId = Util.base64UrlEncode(Util.rleEncode(this.inlineMessageId));
    this.from = new From();
    await this.from.init(BigInt(toString(update.userId) as string), TelestaticClient);
    return this;
  }
}
