// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://guthub.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Media } from './Media';
import { Telestatic } from '../../Client';
import { Cleaning } from '../CleanObject';

export class MediaDice extends Media {
  emoji!: string;
  value!: number;
  constructor() {
    super();
    this['_'] = 'dice';
  }
  async encode(dice: Api.MessageMediaDice, telestaticClient: Telestatic) {
    telestaticClient.log.debug('Creating MediaDice');
    this.telestaticClient = telestaticClient;
    this.emoji = dice.emoticon;
    this.value = dice.value;
    await Cleaning(this);
    return this;
  }
}
