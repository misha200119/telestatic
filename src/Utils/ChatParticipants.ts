// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://guthub.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../Client';
import { From } from './From';
import { Chat } from './Chat';
import { AdminRights } from './AdminRights';
import { BannedRights } from './BannedRight';
import { ResultGetEntity } from '../Telegram/Users/GetEntity';
import { toString } from './ToBigInt';
export type UserStatus = 'self' | 'creator' | 'admin' | 'banned' | 'left' | 'member' | 'restricted';
export class ChannelParticipant {
  user!: From;
  status!: UserStatus;
  adminRights?: AdminRights;
  bannedRights?: BannedRights;
  date: number = Math.floor(Date.now() / 1000);
  canEdit?: boolean;
  self?: boolean;
  inviter?: From;
  promotedBy?: From;
  rank?: string;
  kickedBy?: From;
  constructor() {}
  async init(participant: Api.TypeChannelParticipant, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ChannelParticipant`);
    if (participant instanceof Api.ChannelParticipantCreator) {
      participant as Api.ChannelParticipantCreator;
      this.status = 'creator';
      this.adminRights = new AdminRights(participant.adminRights);
      this.user = new From();
      await this.user.init(BigInt(toString(participant.userId) as string), TelestaticClient);
      return this;
    }
    if (participant instanceof Api.ChannelParticipantAdmin) {
      participant as Api.ChannelParticipantAdmin;
      this.status = 'admin';
      this.adminRights = new AdminRights(participant.adminRights);
      this.canEdit = participant.canEdit;
      this.self = participant.self;
      this.rank = participant.rank;
      this.user = new From();
      await this.user.init(BigInt(toString(participant.userId) as string), TelestaticClient);
      if (participant.inviterId) {
        this.inviter = new From();
        await this.inviter.init(BigInt(toString(participant.inviterId) as string), TelestaticClient);
      }
      if (participant.promotedBy) {
        this.promotedBy = new From();
        await this.promotedBy.init(BigInt(toString(participant.promotedBy) as string), TelestaticClient);
      }
      return this;
    }
    if (participant instanceof Api.ChannelParticipantBanned) {
      participant as Api.ChannelParticipantBanned;
      this.status = 'banned';
      this.bannedRights = new BannedRights(participant.bannedRights);
      if (!participant.left) {
        this.status = 'restricted';
      }
      this.user = new From();
      //@ts-ignore
      await this.user.init(BigInt(toString(participant.peer.userId!) as string), TelestaticClient);
      if (participant.kickedBy) {
        this.kickedBy = new From();
        await this.kickedBy.init(BigInt(toString(participant.kickedBy) as string), TelestaticClient);
      }
      return this;
    }
    if (participant instanceof Api.ChannelParticipantLeft) {
      participant as Api.ChannelParticipantLeft;
      this.status = 'left';
      this.user = new From();
      //@ts-ignore
      await this.user.init(BigInt(toString(participant.peer.userId) as string), TelestaticClient);
      return this;
    }
    if (participant instanceof Api.ChannelParticipantSelf) {
      participant as Api.ChannelParticipantSelf;
      this.status = 'self';
      this.user = new From();
      await this.user.init(BigInt(toString(participant.userId) as string), TelestaticClient);
      if (participant.inviterId) {
        this.inviter = new From();
        await this.inviter.init(BigInt(toString(participant.inviterId) as string), TelestaticClient);
      }
      return this;
    }
    if (participant instanceof Api.ChannelParticipant) {
      participant as Api.ChannelParticipant;
      this.status = 'member';
      this.user = new From();
      await this.user.init(BigInt(toString(participant.userId) as string), TelestaticClient);
      return this;
    }
  }
}
export class ChatParticipant {
  user!: From;
  inviter!: From;
  date!: number;
  status: string = 'member';
  constructor() {}
  async init(participant: Api.ChatParticipant, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ChatParticipant`);
    this.date = participant.date;
    if (participant.userId) {
      let user = new From();
      await user.init(BigInt(toString(participant.userId) as string), TelestaticClient);
      this.user = user;
    }
    if (participant.inviterId) {
      let inviter = new From();
      await inviter.init(BigInt(toString(participant.inviterId) as string), TelestaticClient);
      this.inviter = inviter;
    }
    return this;
  }
}
export class ChatParticipantCreator {
  user!: From;
  status: string = 'creator';
  constructor() {}
  async init(participant: Api.ChatParticipantCreator, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ChatParticipantCreator`);
    if (participant.userId) {
      let user = new From();
      await user.init(BigInt(toString(participant.userId) as string), TelestaticClient);
      this.user = user;
    }
    return this;
  }
}
export class ChatParticipantAdmin {
  user!: From;
  inviter!: From;
  date!: number;
  status: string = 'admin';
  constructor() {}
  async init(participant: Api.ChatParticipantAdmin, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ChatParticipantAdmin`);
    this.date = participant.date;
    if (participant.userId) {
      let user = new From();
      await user.init(BigInt(toString(participant.userId) as string), TelestaticClient);
      this.user = user;
    }
    if (participant.inviterId) {
      let inviter = new From();
      await inviter.init(BigInt(toString(participant.inviterId) as string), TelestaticClient);
      this.inviter = inviter;
    }
    return this;
  }
}
export type TypeChatParticipant =
  | ChatParticipant
  | ChatParticipantAdmin
  | ChatParticipantCreator
  | ChannelParticipant;
export class ChatParticipantsForbidden {
  chat!: Chat;
  selfParticipant?: TypeChatParticipant;
  status: string = 'forbidden';
  constructor() {}
  async init(participant: Api.ChatParticipantsForbidden, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ChatParticipantsForbidden`);
    if (participant.chatId) {
      let chat = new Chat();
      await chat.init(BigInt(toString(participant.chatId) as string), TelestaticClient);
      this.chat = chat;
    }
    if (participant.selfParticipant) {
      if (participant.selfParticipant instanceof Api.ChatParticipant) {
        let selfParticipant = new ChatParticipant();
        await selfParticipant.init(participant.selfParticipant as Api.ChatParticipant, TelestaticClient);
        this.selfParticipant = selfParticipant;
      }
      if (participant.selfParticipant instanceof Api.ChatParticipantCreator) {
        let selfParticipant = new ChatParticipantCreator();
        await selfParticipant.init(
          participant.selfParticipant as Api.ChatParticipantCreator,
          TelestaticClient
        );
        this.selfParticipant = selfParticipant;
      }
      if (participant.selfParticipant instanceof Api.ChatParticipantAdmin) {
        let selfParticipant = new ChatParticipantAdmin();
        await selfParticipant.init(
          participant.selfParticipant as Api.ChatParticipantAdmin,
          TelestaticClient
        );
        this.selfParticipant = selfParticipant;
      }
    }
    return this;
  }
}
export class ChatParticipants {
  chat!: Chat;
  participants!: TypeChatParticipant[];
  version!: number;
  count!: number;
  constructor() {}
  async init(
    participant:
      | Api.ChatParticipants
      | Api.channels.ChannelParticipants
      | Api.channels.ChannelParticipant,
    TelestaticClient: Telestatic
  ) {
    TelestaticClient.log.debug(`Creating ChatParticipants`);
    if (participant instanceof Api.ChatParticipants) {
      return await this._ChatParticipants(participant as Api.ChatParticipants, TelestaticClient);
    }
    if (participant instanceof Api.channels.ChannelParticipants) {
      return await this._ChannelParticipants(
        participant as Api.channels.ChannelParticipants,
        TelestaticClient
      );
    }
    if (participant instanceof Api.channels.ChannelParticipant) {
      return await this._ChannelParticipant(
        participant as Api.channels.ChannelParticipant,
        TelestaticClient
      );
    }
  }
  /** @hidden */
  private async _ChatParticipants(participant: Api.ChatParticipants, TelestaticClient: Telestatic) {
    this.version = participant.version;
    if (participant.chatId) {
      let chat = new Chat();
      await chat.init(BigInt(toString(participant.chatId) as string), TelestaticClient);
      this.chat = chat;
    }
    if (participant.participants) {
      let participants = participant.participants;
      let temp: TypeChatParticipant[] = [];
      this.count = participants.length;
      let i = 0;
      while (true) {
        let item = participants[i];
        if (item instanceof Api.ChatParticipant) {
          let selfParticipant = new ChatParticipant();
          await selfParticipant.init(item as Api.ChatParticipant, TelestaticClient);
          temp.push(selfParticipant);
        }
        if (item instanceof Api.ChatParticipantCreator) {
          let selfParticipant = new ChatParticipantCreator();
          await selfParticipant.init(item as Api.ChatParticipantCreator, TelestaticClient);
          temp.push(selfParticipant);
        }
        if (item instanceof Api.ChatParticipantAdmin) {
          let selfParticipant = new ChatParticipantAdmin();
          await selfParticipant.init(item as Api.ChatParticipantAdmin, TelestaticClient);
          temp.push(selfParticipant);
        }
        if (temp.length >= participants.length) {
          this.participants = temp;
          return this;
        }
        i++;
      }
    }
    return this;
  }
  /** @hidden */
  private async _ChannelParticipants(
    participant: Api.channels.ChannelParticipants,
    TelestaticClient: Telestatic
  ) {
    //@ts-ignore
    this.count = participant.count || participant.participants.length;
    let participants: Api.TypeChannelParticipant[] = participant.participants;
    let temp: ChannelParticipant[] = [];
    //@ts-ignore
    participant.users.map(async (item: Api.User) => {
      let entity = new ResultGetEntity();
      await entity.init(item, TelestaticClient);
      TelestaticClient.entityCache.set(entity.id, entity);
      if (entity.username) TelestaticClient.entityCache.set(entity.username, entity);
    });
    //@ts-ignore
    participant.chats.map(async (item: Api.TypeChat) => {
      if (item instanceof Api.Chat) {
        item as Api.Chat;
      } else {
        item as Api.Channel;
      }
      let entity = new ResultGetEntity();
      await entity.init(item, TelestaticClient);
      TelestaticClient.entityCache.set(entity.id, entity);
      if (entity.username) TelestaticClient.entityCache.set(entity.username, entity);
    });
    let i = 0;
    while (true) {
      let item: Api.TypeChannelParticipant = participants[i];
      let channelPart = new ChannelParticipant();
      await channelPart.init(item, TelestaticClient);
      temp.push(channelPart);
      if (temp.length >= participants.length) {
        this.participants = temp;
        return this;
      }
      i++;
    }
  }
  /** @hidden */
  private async _ChannelParticipant(
    participant: Api.channels.ChannelParticipant,
    TelestaticClient: Telestatic
  ) {
    //@ts-ignore
    this.count = participant.count || participant.participants?.length || 1;
    let participants: Api.TypeChannelParticipant = participant.participant;
    let temp: ChannelParticipant[] = [];
    //@ts-ignore
    participant.users.map(async (item: Api.User) => {
      let entity = new ResultGetEntity();
      await entity.init(item, TelestaticClient);
      TelestaticClient.entityCache.set(entity.id, entity);
      if (entity.username) TelestaticClient.entityCache.set(entity.username, entity);
    });
    //@ts-ignore
    participant.chats.map(async (item: Api.TypeChat) => {
      if (item instanceof Api.Chat) {
        item as Api.Chat;
      } else {
        item as Api.Channel;
      }
      let entity = new ResultGetEntity();
      await entity.init(item, TelestaticClient);
      TelestaticClient.entityCache.set(entity.id, entity);
      if (entity.username) TelestaticClient.entityCache.set(entity.username, entity);
    });
    let channelPart = new ChannelParticipant();
    await channelPart.init(participants, TelestaticClient);
    temp.push(channelPart);
    this.participants = temp;
    return this;
  }
}
export type TypeChatParticipants = ChatParticipants | ChatParticipantsForbidden;
