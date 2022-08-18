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
// TODO :
// convert _photo to telestatic json
export class MediaInvoice extends Media {
  /** @hidden */
  _photo?: Api.TypeWebDocument;
  shippingAddressRequested?: boolean;
  test?: boolean;
  receiptMsgId?: number;
  title!: string;
  description!: string;
  currency!: string;
  totalAmount!: bigint;
  startParam!: string;
  constructor() {
    super();
    this['_'] = 'invoice';
  }
  async encode(invoice: Api.MessageMediaInvoice, telestaticClient: Telestatic) {
    telestaticClient.log.debug('Creating MediaInvoice');
    this.telestaticClient = telestaticClient;
    this.title = invoice.title;
    this.description = invoice.description;
    this.currency = invoice.currency;
    this.totalAmount = BigInt(String(invoice.totalAmount));
    this.startParam = invoice.startParam;
    this._photo = invoice.photo;
    this.shippingAddressRequested = invoice.shippingAddressRequested;
    this.test = invoice.test;
    this.receiptMsgId = invoice.receiptMsgId;
    return this;
  }
}
