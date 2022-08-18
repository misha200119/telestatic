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

export class MediaContact extends Media {
  phoneNumber!: string;
  firstName!: string;
  lastName?: string;
  vcard!: string;
  userId!: bigint;
  constructor() {
    super();
    this['_'] = 'contact';
  }
  encode(contact: Api.MessageMediaContact, telestaticClient: Telestatic) {
    telestaticClient.log.debug('Creating MediaContact');
    this.telestaticClient = telestaticClient;
    this.phoneNumber = contact.phoneNumber;
    this.firstName = contact.firstName;
    this.lastName = contact.lastName;
    this.vcard = contact.vcard;
    this.userId = BigInt(String(contact.userId));
    return this;
  }
}
