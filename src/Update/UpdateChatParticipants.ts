// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Telestatic } from '../Client';
import { Update } from './Update';
import { Telegram } from '../Telegram';
import {
  TypeChatParticipants,
  ChatParticipants,
  ChatParticipantsForbidden,
} from '../Utils/ChatParticipants';
import { Api } from 'telegram';

export class UpdateChatParticipants extends Update {
  participants!: TypeChatParticipants;
  constructor() {
    super();
    this['_'] = 'updateChatParticipants';
  }
  async init(update: Api.UpdateChatParticipants, TelestaticClient: Telestatic) {
    TelestaticClient.log.debug(`Creating ${this['_']}`);
    this.telegram = TelestaticClient.telegram;
    if (update.participants) {
      if (update.participants instanceof Api.ChatParticipants) {
        let participants = new ChatParticipants();
        await participants.init(update.participants as Api.ChatParticipants, TelestaticClient);
        this.participants = participants;
      }
      if (update.participants instanceof Api.ChatParticipantsForbidden) {
        let participants = new ChatParticipantsForbidden();
        await participants.init(update.participants as Api.ChatParticipantsForbidden, TelestaticClient);
        this.participants = participants;
      }
    }
    return this;
  }
}
