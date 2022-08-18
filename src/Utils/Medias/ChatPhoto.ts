// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://guthub.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Media } from './Media';
import { FileId, decodeFileId } from 'tg-file-id';
import { Telestatic } from '../../Client';
import bigInt, { BigInteger } from 'big-integer';
import { Cleaning } from '../CleanObject';
import BotError from '../../Context/Error';
import { DownloadFileParams } from '../../Interface/Download';

export class MediaChatPhoto extends Media {
  /** @hidden */
  _id!: bigint;
  /** @hidden */
  _dialogAccessHash!: bigint;
  /** @hidden */
  _dialogId!: bigint;
  isBig!: boolean;
  fileId!: string;
  uniqueFileId!: string;
  dcId!: number;
  constructor() {
    super();
    this['_'] = 'chatPhoto';
  }
  async encode(
    chatPhoto: Api.ChatPhoto | Api.UserProfilePhoto,
    dialogId: bigint,
    dialogAccessHash: bigint,
    telestaticClient: Telestatic
  ) {
    telestaticClient.log.debug('Creating MediaChatPhoto');
    this.telestaticClient = telestaticClient;
    this._dialogId = dialogId;
    this._dialogAccessHash = dialogAccessHash;
    this.isBig = true;
    this.dcId = chatPhoto.dcId;
    this._id = BigInt(String(chatPhoto.photoId));
    let file = new FileId();
    file.fileType = 'profile_photo';
    file.typeId = 1;
    file.version = 4;
    file.subVersion = 30;
    file.dcId = this.dcId;
    file.id = this._id;
    file.accessHash = BigInt(0);
    file.photoSizeSource = 'dialogPhoto';
    file.dialogId = dialogId;
    file.isSmallDialogPhoto = false;
    file.photoSizeSourceId = 3;
    file.dialogAccessHash = dialogAccessHash;
    file.volumeId = BigInt(1);
    this.fileId = await file.toFileId();
    this.uniqueFileId = await file.toFileUniqId();
    await Cleaning(this);
    return this;
  }
  async download(fileId?: string, params?: DownloadFileParams) {
    this.telestaticClient.log.debug('Downloading chat photo');
    const { client, log } = this.telestaticClient;
    const file = fileId ?? this.fileId;
    const inRange = (x: number, min: number, max: number) => {
      return (x - min) * (x - max) <= 0;
    };
    const getInputPeer = (dialogId: bigint, dialogAccessHash: bigint) => {
      if (String(dialogId).startsWith('-100')) {
        return new Api.InputPeerChannel({
          channelId: bigInt(String(dialogId)),
          accessHash: bigInt(String(dialogAccessHash)),
        });
      }
      if (String(dialogId).startsWith('-')) {
        return new Api.InputPeerChat({
          chatId: bigInt(String(dialogId)),
        });
      }
      return new Api.InputPeerUser({
        userId: bigInt(String(dialogId)),
        accessHash: bigInt(String(dialogAccessHash)),
      });
    };
    if (!file) {
      this.telestaticClient.log.error('Failed to download chat photo cause: FileId not found!');
      throw new BotError('FileId not found!', 'ChatPhoto.download', String(file));
    }
    if (file !== this.fileId) {
      let dFile = this.decode(file);
      if (dFile.typeId !== 1) {
        this.telestaticClient.log.error('Failed to download chat photo cause: Miss match file type!');
        throw new BotError('Miss match file type!', 'ChatPhoto.download', String(file));
      }
      let dParams = Object.assign(
        {
          dcId: dFile.dcId,
          workers: 1,
          progressCallback: (progress) => {
            return log.debug(`Downloading chat photo [${Math.round(progress)}]`);
          },
        },
        params ?? {}
      );
      if (!inRange(dParams.workers!, 1, 16)) {
        log.warning(
          `Workers (${dParams.workers}) out of range (1 <= workers <= 16). Chances are this will make telestatic unstable.`
        );
      }
      return client.downloadFile(
        new Api.InputPeerPhotoFileLocation({
          big: dFile.photoSize == 'big',
          peer: getInputPeer(
            BigInt(String(dFile.dialogId!)),
            BigInt(String(dFile.dialogAccessHash!))
          ),
          photoId: bigInt(String(dFile.id)),
        }),
        dParams!
      );
    }
    let dParams = Object.assign(
      {
        dcId: this.dcId,
        workers: 1,
        progressCallback: (progress) => {
          return log.debug(`Downloading chat photo [${Math.round(progress)}]`);
        },
      },
      params ?? {}
    );
    if (!inRange(dParams.workers!, 1, 16)) {
      log.warning(
        `Workers (${dParams.workers}) out of range (1 <= workers <= 16). Chances are this will make telestatic unstable.`
      );
    }
    return client.downloadFile(
      new Api.InputPeerPhotoFileLocation({
        big: this.isBig,
        peer: getInputPeer(this._dialogId!, this._dialogAccessHash!),
        photoId: bigInt(String(this._id)),
      }),
      dParams!
    );
  }
}
