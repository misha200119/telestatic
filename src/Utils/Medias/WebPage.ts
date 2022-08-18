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
import { MediaPhoto } from './Photo';
// TODO:
// convert field document,cachedPage to telestatic json
export class MediaWebPage extends Media {
  id!: bigint;
  url!: string;
  displayUrl!: string;
  hash!: number;
  type?: string;
  siteName?: string;
  title?: string;
  description?: string;
  photo?: MediaPhoto;
  embedUrl?: string;
  embedType?: string;
  embedWidth?: number;
  embedHeight?: number;
  duration?: number;
  author?: string;
  constructor() {
    super();
    this['_'] = 'webPage';
  }
  async encode(webPage: Api.TypeWebPage, telestaticClient: Telestatic) {
    telestaticClient.log.debug('Creating MediaWebPage');
    this.telestaticClient = telestaticClient;
    //@ts-ignore
    if (webPage.id !== undefined) this.id = BigInt(String(webPage.id!));
    if (webPage instanceof Api.WebPage) {
      webPage as Api.WebPage;
      this.url = webPage.url;
      this.displayUrl = webPage.displayUrl;
      this.hash = webPage.hash;
      this.type = webPage.type;
      this.siteName = webPage.siteName;
      this.title = webPage.title;
      this.description = webPage.description;
      this.embedUrl = webPage.embedUrl;
      this.embedType = webPage.embedType;
      this.embedWidth = webPage.embedWidth;
      this.embedHeight = webPage.embedHeight;
      this.duration = webPage.duration;
      this.author = webPage.author;
      if (webPage.photo) {
        this.photo = new MediaPhoto();
        await this.photo.encode(webPage.photo!, telestaticClient);
      }
    }
    return this;
  }
}
