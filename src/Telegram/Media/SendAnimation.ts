// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import { SendMedia, sendMediaMoreParams } from './SendMedia';
import { UploadFile } from './UploadFile';
import { decodeFileId } from 'tg-file-id';
import * as Medias from '../../Utils/Medias';
import bigInt from 'big-integer';
import { GetFileInfo } from './GetFileInfo';
import path from 'path';
import BotError from '../../Context/Error';
import { onProgress } from './UploadFile';
export interface sendAnimationMoreParams extends sendMediaMoreParams {
  workers?: number;
  mimeType?: string;
  onProgress?: onProgress;
  download?: boolean;
  thumbnail?: Buffer | string;
  width?: number;
  height?: number;
  duration?: number;
  supportsStreaming?: boolean;
}
function clean(more?: sendAnimationMoreParams) {
  if (more) {
    let purge = [
      'workers',
      'mimeType',
      'duration',
      'onProgress',
      'download',
      'thumbnail',
      'width',
      'height',
      'supportsStreaming',
    ];
    for (let [key] of Object.entries(more)) {
      if (purge.includes(key)) delete more[key];
    }
  }
  return more;
}
/**
 * Sending Animation
 * @param telestaticClient - Client
 * @param {string|number|bigint} chatId - Chat/Groups/Channel id.
 * @param {string|Buffer} fileId - File Location/Url/Buffer .
 * @param {Object} more - more parameters to use.
 * ```ts
 * bot.command("ani",async (ctx) => {
 *     let results = await ctx.telegram.sendAnimation(ctx.chat.id,"file id here")
 * })
 * ```
 */
export async function SendAnimation(
  telestaticClient: Telestatic,
  chatId: number | string | bigint,
  fileId: string | Buffer | Medias.MediaAnimation,
  more?: sendAnimationMoreParams
) {
  try {
    telestaticClient.log.debug('Running telegram.ndAnimation');
    if (typeof chatId === 'number')
      telestaticClient.log.warning(
        'Type of chatId is number, please switch to BigInt or String for security Ids 64 bit int.'
      );
    const validateThumb = (thumb: string | Buffer) => {
      switch (thumb.constructor) {
        case Buffer:
          return true;
          break;
        case String:
          thumb as string;
          if (/^http/i.test(String(thumb)) || /^(\/|\.\.?\/|~\/)/i.test(String(thumb))) return true;
          return false;
          break;
        default:
          return false;
      }
    };
    switch (fileId.constructor) {
      case Buffer:
        fileId as Buffer;
        let bufferInfo = await GetFileInfo(fileId as Buffer);
        return await SendMedia(
          telestaticClient,
          chatId,
          new Api.InputMediaUploadedDocument({
            //@ts-ignore
            file: await UploadFile(telestaticClient, bufferInfo.source as Buffer, {
              workers: more?.workers || 1,
              onProgress: more?.onProgress,
            }),
            //@ts-ignore
            mimeType: bufferInfo.mime || more?.mimeType || 'video/mp4',
            attributes: [
              new Api.DocumentAttributeVideo({
                roundMessage: false,
                supportsStreaming: more?.supportsStreaming ?? true,
                duration: more?.duration ?? 0,
                w: more?.width ?? 0,
                h: more?.height ?? 0,
              }),
              new Api.DocumentAttributeAnimated(),
            ],
            forceFile: false,
            ...(more && more.thumbnail && validateThumb(more.thumbnail)
              ? {
                  thumb: await UploadFile(telestaticClient, more.thumbnail!, {
                    workers: more.workers || 1,
                  }),
                }
              : {}),
          }),
          clean(more)
        );
        break;
      case Medias.MediaAnimation:
        return await SendMedia(
          telestaticClient,
          chatId,
          new Api.InputMediaDocument({
            id: new Api.InputDocument({
              //@ts-ignore
              id: bigInt(String(fileId._id)),
              //@ts-ignore
              accessHash: bigInt(String(fileId._accessHash)),
              //@ts-ignore
              fileReference: Buffer.from(fileId._fileReference, 'hex'),
            }),
          })
        );
        break;
      case String:
        fileId as string;
        if (/^http/i.test(String(fileId)) || /^(\/|\.\.?\/|~\/)/i.test(String(fileId))) {
          let download = more?.download ?? false;
          if (/^http/i.test(String(fileId)) && !download) {
            let file = new Api.InputMediaDocumentExternal({
              url: fileId as string,
            });
            return await SendMedia(telestaticClient, chatId, file, clean(more));
          }
          let fileInfo = await GetFileInfo(String(fileId));
          let basename = path.basename(String(fileId));
          if (!/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim.exec(basename)) {
            basename = `${basename}.${fileInfo?.ext}`;
          }
          return await SendMedia(
            telestaticClient,
            chatId,
            new Api.InputMediaUploadedDocument({
              //@ts-ignore
              file: await UploadFile(telestaticClient, fileInfo.source as Buffer, {
                workers: more?.workers || 1,
                fileName: basename,
                onProgress: more?.onProgress,
              }),
              //@ts-ignore
              mimeType: fileInfo.mime || more?.mimeType || 'video/mp4',
              attributes: [
                new Api.DocumentAttributeVideo({
                  roundMessage: false,
                  supportsStreaming: more?.supportsStreaming ?? true,
                  duration: more?.duration ?? 0,
                  w: more?.width ?? 0,
                  h: more?.height ?? 0,
                }),
                new Api.DocumentAttributeAnimated(),
              ],
              forceFile: false,
              ...(more && more.thumbnail && validateThumb(more.thumbnail)
                ? {
                    thumb: await UploadFile(telestaticClient, more.thumbnail!, {
                      workers: more.workers || 1,
                    }),
                  }
                : {}),
            }),
            clean(more)
          );
        } else {
          //@ts-ignore
          let file = await decodeFileId(fileId);
          if (file.typeId !== 10) throw new Error(`Invalid fileId. This fileId not for animation`);
          return await SendMedia(
            telestaticClient,
            chatId,
            new Api.InputMediaDocument({
              id: new Api.InputDocument({
                id: bigInt(String(file.id)),
                accessHash: bigInt(String(file.access_hash)),
                fileReference: Buffer.from(file.fileReference, 'hex'),
              }),
            })
          );
        }
        break;
      default:
        throw new Error(`Couldn't resolve this fileId.`);
    }
  } catch (error: any) {
    telestaticClient.log.error('Failed to running telegram.sendAnimation');
    throw new BotError(
      error.message,
      'telegram.sendAnimation',
      `${chatId},${
        Buffer.isBuffer(fileId) ? `<Buffer ${fileId.toString('hex')}>` : JSON.stringify(fileId)
      }${more ? ',' + JSON.stringify(more) : ''}`
    );
  }
}
