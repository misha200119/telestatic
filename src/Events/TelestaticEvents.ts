// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import {
  _intoIdSet,
  DefaultEventInterface,
  EventBuilder,
  EventCommon,
} from 'telegram/events/common';
import { Api } from 'telegram';
import { Telestatic } from '../Client';
import { TelegramClient } from 'telegram';
import bigInt, { BigInteger } from 'big-integer';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import type { Entity, EntityLike } from 'telegram/define';

export interface InterfaceTelestaticEvent extends DefaultEventInterface {
  func?: { (event: Api.TypeUpdate | Api.TypeUpdates): any };
}

export class TelestaticEvent extends EventBuilder {
  /** @hidden */
  private _TelestaticClient!: Telestatic;
  constructor(TelestaticClient: Telestatic, eventParams: InterfaceTelestaticEvent) {
    let { chats, blacklistChats, func } = eventParams;
    super({ chats, blacklistChats, func });
    this._TelestaticClient = TelestaticClient;
  }
  async build(update: Api.TypeUpdate | Api.TypeUpdates, callback: undefined, selfId: BigInteger) {
    //@ts-ignore
    if (update._entities && update._entities.size) {
      //@ts-ignore
      for (let [key, value] of update._entities.entries()) {
        let entities = new ResultGetEntity();
        await entities.init(value!, this._TelestaticClient);
        this._TelestaticClient.log.debug(`Add or Update Entities (${entities.id}) to cache.`);
        this._TelestaticClient.entityCache.set(entities.id!, entities!);
        if (entities.username) this._TelestaticClient.entityCache.set(entities.username!, entities!);
      }
    }
    return update;
  }
}
