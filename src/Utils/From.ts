// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://guthub.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../Client';
import { MediaChatPhoto } from './Medias';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import { RestrictionReason } from './RestrictionReason';
import { toBigInt, toString } from './ToBigInt';
import bigInt, { BigInteger, isInstance } from 'big-integer';
import { Cleaning, betterConsoleLog } from './CleanObject';
export class From {
  id!: bigint;
  firstName?: string;
  lastName?: string;
  username?: string;
  status?: string;
  self?: boolean;
  deleted?: boolean;
  fake?: boolean;
  scam?: boolean;
  bot?: boolean;
  verified?: boolean;
  restricted?: boolean;
  dcId?: number;
  photo?: MediaChatPhoto;
  restrictionReason?: RestrictionReason[];
  accessHash?: bigint;
  constructor() {}
  async init(peer: Api.TypePeer | number | bigint | string, telestaticClient: Telestatic) {
    let id: bigint | string | number | undefined;
    if (typeof peer !== 'number' && typeof peer !== 'bigint' && typeof peer !== 'string') {
      if (peer instanceof Api.PeerUser) {
        peer as Api.PeerUser;
        if (isInstance(peer.userId)) {
          //@ts-ignore
          id = BigInt(toString(peer.userId));
        } else {
          //@ts-ignore
          id = BigInt(peer.userId);
        }
      }
      if (peer instanceof Api.PeerChat) {
        peer as Api.PeerChat;
        if (isInstance(peer.chatId)) {
          //@ts-ignore
          id = BigInt(Number(`-${toString(peer.chatId)}`));
        } else {
          //@ts-ignore
          id = BigInt(Number(`-${peer.chatId}`));
        }
      }
      if (peer instanceof Api.PeerChannel) {
        peer as Api.PeerChannel;
        if (isInstance(peer.channelId)) {
          //@ts-ignore
          id = BigInt(Number(`-100${toString(peer.channelId)}`));
        } else {
          //@ts-ignore
          id = BigInt(Number(`-100${peer.channelId}`));
        }
      }
    } else {
      id = typeof peer == 'number' ? BigInt(peer) : peer;
    }
    if (id) {
      telestaticClient.log.debug(`Creating User ${id}`);
      try {
        let entity = await telestaticClient.telegram.getEntity(id, true);
        this.id = entity.id;
        this.username = entity.username;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.status = entity.status;
        this.self = entity.self;
        this.deleted = entity.deleted;
        this.fake = entity.fake;
        this.scam = entity.scam;
        this.bot = entity.bot;
        this.verified = entity.verified;
        this.restricted = entity.restricted;
        this.dcId = entity.dcId;
        this.photo = entity.photo;
        this.restrictionReason = entity.restrictionReason;
        this.accessHash = entity.accessHash;
      } catch (error) {
        return this;
      }
    }
    await Cleaning(this);
    return this;
  }
  /** @hidden */
  toJSON() {
    let obj = betterConsoleLog(this);
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value == 'bigint') obj[key] = String(value);
    }
    return obj;
  }
}
