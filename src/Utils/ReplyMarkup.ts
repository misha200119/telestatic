// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://guthub.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published

import { Api } from 'telegram';
import bigInt, { BigInteger } from 'big-integer';
import { Telestatic } from '../Client';
import { convertId, toBigInt } from './ToBigInt';
export type TypeReplyMarkup = inlineKeyboard | replyKeyboard | removeKeyboard | forceReplyMarkup;
/**
 * Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot's message and tapped 'Reply')
 */
export interface forceReplyMarkup {
  /**
   * Shows reply interface to the user, as if they manually selected the bot's message and tapped 'Reply'
   */
  forceReply: boolean;
  /**
   * The placeholder to be shown in the input field when the reply is active
   */
  inputFieldPlaceholder?: string;
  /**
   * Use this parameter if you want to force reply from specific users only.
   */
  selective?: boolean;
  /**
   * Requests clients to hide the keyboard as soon as it's been used.
   */
  singleUse?: boolean;
}
/**
 * Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard.
 */
export interface removeKeyboard {
  /**
   * Requests clients to remove the custom keyboard (user will not be able to summon this keyboard
   */
  removeKeyboard: boolean;
  /**
   * Use this parameter if you want to remove the keyboard for specific users only
   */
  selective?: boolean;
}
/**
 * Bot keyboard
 */
export interface replyKeyboard {
  /**
   * Array of array of {@link replyKeyboardButton} or Array of array of string.
   * @example
   * ```ts
   * [["hello"]]
   * ```
   */
  keyboard: replyKeyboardButton[][] | string[][];
  /**
   * Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons).
   */
  resizeKeyboard?: boolean;
  /**
   * Requests clients to hide the keyboard as soon as it's been used.
   */
  oneTimeKeyboard?: boolean;
  /**
   * The placeholder to be shown in the input field when the keyboard is active.
   */
  inputFieldPlaceholder?: string;
  /**
   * Use this parameter if you want to show the keyboard to specific users only.
   */
  selective?: boolean;
}
export interface replyKeyboardButton {
  /** keyboard text */
  text: string;
  /** The user's phone number will be sent as a contact when the button is pressed */
  requestContact?: boolean;
  /** The user's current location will be sent when the button is pressed. */
  requestLocation?: boolean;
  /**
   * The user will be asked to create a poll and send it to the bot when the button is pressed. <br/>
   * If _quiz_ is passed, the user will be allowed to create only polls in the quiz mode. <br/>
   * If _regular_ is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of _any_ type.
   */
  requestPoll?: 'regular' | 'quiz';
}
/**
 * Bot button
 */
export interface inlineKeyboard {
  /**
   * array of array of {@link inlineKeyboardButton}
   * @example
   * ```ts
   * [[{
   *  text : "button", // the text of button
   *  callbackData : "cbdata" // the callback data of button.
   * }]]
   * ```
   */
  inlineKeyboard: inlineKeyboardButton[][];
}
export interface inlineKeyboardButton {
  /** Button text */
  text: string;
  /** Button url */
  url?: string;
  /** loginUrl button*/
  loginUrl?: loginUrl;
  /** callback data button */
  callbackData?: string;
  /** query to fill the inline query */
  switchInlineQuery?: string;
  /** query to fill the inline query */
  switchInlineQueryCurrentChat?: string;
  /** description of game */
  callbackGame?: string;
  /** description of product */
  buy?: string;
}
export interface loginUrl {
  /**
   * Set this flag to request the permission for your bot to send messages to the user.
   */
  requestWriteAccess?: boolean;
  /**
   * New text of the button in forwarded messages.
   */
  forwardText?: string;
  /**
   * An HTTP URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in Receiving authorization data. <br/>
   * NOTE: You must always check the hash of the received data to verify the authentication and the integrity of the data as described in Checking authorization.
   */
  url: string;
  /**
   * id and access hash of a bot, which will be used for user authorization. The url's domain must be the same as the domain linked with the bot.
   */
  bot: BotLoginUrl;
}
export interface BotLoginUrl {
  /**
   * Bot Id.
   * bot id getting from .getEntity()
   */
  id: bigint;
  /**
   * Bot access hash
   * access hash getting from .getEntity()
   */
  accessHash: bigint;
}

export async function BuildReplyMarkup(replyMarkup: TypeReplyMarkup, telestaticClient: Telestatic) {
  // inlineKeyboard
  if ('inlineKeyboard' in replyMarkup) {
    return await replyMarkupInlineKeyboard(replyMarkup as inlineKeyboard, telestaticClient);
  }
  // keyboard
  if ('keyboard' in replyMarkup) {
    return await replyMarkupKeyboard(replyMarkup as replyKeyboard);
  }
  // removeKeyboard
  if ('removeKeyboard' in replyMarkup) {
    return await replyMarkupRemoveKeyboard(replyMarkup as removeKeyboard);
  }
  // forceReply
  if ('forceReply' in replyMarkup) {
    return await replyMarkupForceReply(replyMarkup as forceReplyMarkup);
  }
}
async function replyMarkupInlineKeyboard(replyMarkup: inlineKeyboard, telestaticClient: Telestatic) {
  let rows: Api.KeyboardButtonRow[] = [];
  for (let row = 0; row < replyMarkup.inlineKeyboard.length; row++) {
    let tempCol: Api.TypeKeyboardButton[] = [];
    for (let col = 0; col < replyMarkup.inlineKeyboard[row].length; col++) {
      let btn: inlineKeyboardButton = replyMarkup.inlineKeyboard[row][col] as inlineKeyboardButton;
      // button url
      if (btn.url) {
        if (String(btn.url).startsWith('tg://user?id=')) {
          let [id, type, peer] = await toBigInt(
            BigInt(String(btn.url).replace('tg://user?id=', '')),
            telestaticClient
          );
          if (type !== 'user') continue;
          tempCol.push(
            new Api.InputKeyboardButtonUserProfile({
              text: String(btn.text),
              //@ts-ignore
              userId: new Api.InputUser({
                //@ts-ignore
                userId: peer.userId,
                //@ts-ignore
                accessHash: peer.accessHash,
              }),
            })
          );
        } else {
          tempCol.push(
            new Api.KeyboardButtonUrl({
              text: String(btn.text),
              url: String(btn.url),
            })
          );
        }
        continue;
      }
      // button login url
      if (btn.loginUrl) {
        tempCol.push(
          new Api.InputKeyboardButtonUrlAuth({
            text: String(btn.text),
            requestWriteAccess: btn.loginUrl?.requestWriteAccess || true,
            fwdText: btn.loginUrl?.forwardText || String(btn.text),
            url: String(btn.loginUrl?.url),
            bot: new Api.InputUser({
              userId: bigInt(btn.loginUrl?.bot.id! as bigint) as BigInteger,
              accessHash: bigInt(btn.loginUrl?.bot.accessHash! as bigint) as BigInteger,
            }),
          })
        );
        continue;
      }
      // button callbackData
      if (btn.callbackData) {
        tempCol.push(
          new Api.KeyboardButtonCallback({
            text: String(btn.text),
            requiresPassword: false,
            data: Buffer.from(String(btn.callbackData)),
          })
        );
        continue;
      }
      // button switch inline query
      if (btn.switchInlineQuery) {
        tempCol.push(
          new Api.KeyboardButtonSwitchInline({
            text: String(btn.text),
            samePeer: false,
            query: String(btn.switchInlineQuery),
          })
        );
        continue;
      }
      // button switch inline query current peer
      if (btn.switchInlineQueryCurrentChat) {
        tempCol.push(
          new Api.KeyboardButtonSwitchInline({
            text: String(btn.text),
            samePeer: true,
            query: String(btn.switchInlineQueryCurrentChat),
          })
        );
        continue;
      }
      // button game
      if (btn.callbackGame) {
        tempCol.push(
          new Api.KeyboardButtonGame({
            text: String(btn.text),
          })
        );
        continue;
      }
      // button buy
      if (btn.buy) {
        tempCol.push(
          new Api.KeyboardButtonBuy({
            text: String(btn.text),
          })
        );
        continue;
      }
    }
    rows.push(
      new Api.KeyboardButtonRow({
        buttons: tempCol,
      })
    );
  }
  return new Api.ReplyInlineMarkup({
    rows: rows,
  });
}
function replyMarkupKeyboard(replyMarkup: replyKeyboard) {
  let rows: Api.KeyboardButtonRow[] = [];
  for (let row = 0; row < replyMarkup.keyboard.length; row++) {
    let tempCol: Api.TypeKeyboardButton[] = [];
    for (let col = 0; col < replyMarkup.keyboard[row].length; col++) {
      // if string[][]
      if (typeof replyMarkup.keyboard[row][col] == 'string') {
        tempCol.push(
          new Api.KeyboardButton({
            text: String(replyMarkup.keyboard[row][col]),
          })
        );
        continue;
      }
      if (typeof replyMarkup.keyboard[row][col] !== 'string') {
        let btn: replyKeyboardButton = replyMarkup.keyboard[row][col] as replyKeyboardButton;
        // keyboard requestContact
        if (btn.requestContact) {
          tempCol.push(
            new Api.KeyboardButtonRequestPhone({
              text: String(btn.text),
            })
          );
          continue;
        }
        //keyboard requestLocation
        if (btn.requestLocation) {
          tempCol.push(
            new Api.KeyboardButtonRequestGeoLocation({
              text: String(btn.text),
            })
          );
          continue;
        }
        //keyboard requestPoll
        if (btn.requestPoll) {
          tempCol.push(
            new Api.KeyboardButtonRequestPoll({
              text: String(btn.text),
              quiz: Boolean(btn.requestPoll.toLowerCase() == 'quiz'),
            })
          );
          continue;
        }
        // keyboard text
        if (btn.text) {
          if (!btn.requestPoll && !btn.requestLocation && !btn.requestContact) {
            tempCol.push(
              new Api.KeyboardButton({
                text: String(btn.text),
              })
            );
            continue;
          }
        }
      }
    }
    rows.push(
      new Api.KeyboardButtonRow({
        buttons: tempCol,
      })
    );
  }
  return new Api.ReplyKeyboardMarkup({
    rows: rows,
    resize: replyMarkup.resizeKeyboard || undefined,
    singleUse: replyMarkup.oneTimeKeyboard || undefined,
    placeholder: replyMarkup.inputFieldPlaceholder || undefined,
    selective: replyMarkup.selective || undefined,
  });
}
function replyMarkupRemoveKeyboard(replyMarkup: removeKeyboard) {
  return new Api.ReplyKeyboardHide({
    selective: replyMarkup.selective || undefined,
  });
}
function replyMarkupForceReply(replyMarkup: forceReplyMarkup) {
  return new Api.ReplyKeyboardForceReply({
    singleUse: replyMarkup.singleUse || undefined,
    selective: replyMarkup.selective || undefined,
    placeholder: replyMarkup.inputFieldPlaceholder || undefined,
  });
}

export async function convertReplyMarkup(
  replyMarkup: Api.TypeReplyMarkup,
  TelestaticClient: Telestatic
): Promise<TypeReplyMarkup | undefined> {
  // force reply
  if (replyMarkup instanceof Api.ReplyKeyboardForceReply) {
    replyMarkup as Api.ReplyKeyboardForceReply;
    let markup: forceReplyMarkup = {
      forceReply: true,
      selective: replyMarkup.selective || undefined,
      singleUse: replyMarkup.singleUse || undefined,
      inputFieldPlaceholder: replyMarkup.placeholder || undefined,
    };
    return markup;
  }
  // removeKeyboard
  if (replyMarkup instanceof Api.ReplyKeyboardHide) {
    replyMarkup as Api.ReplyKeyboardHide;
    let markup: removeKeyboard = {
      removeKeyboard: true,
      selective: replyMarkup.selective || undefined,
    };
  }
  // KeyboardButton
  if (replyMarkup instanceof Api.ReplyKeyboardMarkup) {
    replyMarkup as Api.ReplyKeyboardMarkup;
    let rows: replyKeyboardButton[][] = [];
    for (let i = 0; i < replyMarkup.rows.length; i++) {
      let col: replyKeyboardButton[] = [];
      let btns: Api.KeyboardButtonRow = replyMarkup.rows[i];
      for (let j = 0; j < btns.buttons.length; j++) {
        let btn: Api.TypeKeyboardButton = btns.buttons[j];
        if (btn instanceof Api.KeyboardButton) {
          btn as Api.KeyboardButton;
          let cc: replyKeyboardButton = {
            text: btn.text,
          };
          col.push(cc);
        }
        if (btn instanceof Api.KeyboardButtonRequestPhone) {
          btn as Api.KeyboardButtonRequestPhone;
          let cc: replyKeyboardButton = {
            text: btn.text,
            requestContact: true,
          };
          col.push(cc);
        }
        if (btn instanceof Api.KeyboardButtonRequestGeoLocation) {
          btn as Api.KeyboardButtonRequestGeoLocation;
          let cc: replyKeyboardButton = {
            text: btn.text,
            requestLocation: true,
          };
          col.push(cc);
        }
        if (btn instanceof Api.KeyboardButtonRequestPoll) {
          btn as Api.KeyboardButtonRequestPoll;
          let cc: replyKeyboardButton = {
            text: btn.text,
            requestPoll: btn.quiz ? 'quiz' : 'regular',
          };
          col.push(cc);
        }
      }
      rows.push(col);
    }
    let markup: replyKeyboard = {
      keyboard: rows,
      resizeKeyboard: replyMarkup.resize || undefined,
      oneTimeKeyboard: replyMarkup.singleUse || undefined,
      inputFieldPlaceholder: replyMarkup.placeholder || undefined,
      selective: replyMarkup.selective || undefined,
    };
    return markup;
  }
  // inlineKeyboardButton
  if (replyMarkup instanceof Api.ReplyInlineMarkup) {
    replyMarkup as Api.ReplyInlineMarkup;
    let rows: inlineKeyboardButton[][] = [];
    for (let i = 0; i < replyMarkup.rows.length; i++) {
      let col: inlineKeyboardButton[] = [];
      let btns: Api.KeyboardButtonRow = replyMarkup.rows[i];
      for (let j = 0; j < btns.buttons.length; j++) {
        let btn: Api.TypeKeyboardButton = btns.buttons[j];
        if (btn instanceof Api.KeyboardButtonUserProfile) {
          btn as Api.KeyboardButtonUserProfile;
          let cc: inlineKeyboardButton = {
            text: btn.text,
            url: `tg://user?id=${btn.userId}`,
          };
          col.push(cc);
        }
        if (btn instanceof Api.KeyboardButtonUrl) {
          btn as Api.KeyboardButtonUrl;
          let cc: inlineKeyboardButton = {
            text: btn.text,
            url: btn.url,
          };
          col.push(cc);
        }
        if (btn instanceof Api.KeyboardButtonUrlAuth) {
          btn as Api.KeyboardButtonUrlAuth;
          let me = await TelestaticClient.telegram.getMe();
          let ee: BotLoginUrl = {
            id: me.id!,
            accessHash: me.accessHash! as bigint,
          };
          let dd: loginUrl = {
            requestWriteAccess: true,
            forwardText: btn.fwdText || String(btn.text),
            url: String(btn.url),
            bot: ee,
          };
          let cc: inlineKeyboardButton = {
            loginUrl: dd,
            text: btn.text,
          };
          col.push(cc);
        }
        if (btn instanceof Api.KeyboardButtonCallback) {
          btn as Api.KeyboardButtonCallback;
          let cc: inlineKeyboardButton = {
            text: btn.text,
            callbackData: btn.data.toString('utf8'),
          };
          col.push(cc);
        }
        if (btn instanceof Api.KeyboardButtonSwitchInline) {
          btn as Api.KeyboardButtonSwitchInline;
          if (btn.samePeer) {
            let cc: inlineKeyboardButton = {
              text: btn.text,
              switchInlineQueryCurrentChat: btn.query,
            };
            col.push(cc);
          } else {
            let cc: inlineKeyboardButton = {
              text: btn.text,
              switchInlineQuery: btn.query,
            };
            col.push(cc);
          }
        }
        if (btn instanceof Api.KeyboardButtonGame) {
          btn as Api.KeyboardButtonGame;
          let cc: inlineKeyboardButton = {
            text: btn.text,
            callbackGame: btn.text,
          };
          col.push(cc);
        }
        if (btn instanceof Api.KeyboardButtonBuy) {
          btn as Api.KeyboardButtonBuy;
          let cc: inlineKeyboardButton = {
            text: btn.text,
            buy: btn.text,
          };
          col.push(cc);
        }
      }
      rows.push(col);
    }
    let markup: inlineKeyboard = {
      inlineKeyboard: rows,
    };
    return markup;
  }
}
