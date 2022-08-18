// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { betterConsoleLog } from '../Utils/CleanObject';
import { inspect } from 'util';
export default class BotError extends Error {
  functionName!: string;
  functionArgs!: string;
  message!: string;
  date: number = Math.floor(Date.now() / 1000);
  /** @hidden */
  _isBotErrorClass: boolean = true;
  constructor(message: string, functionName: string, functionArgs: string) {
    super();
    this.message = message;
    this.functionName = functionName;
    this.functionArgs = functionArgs;
    return this;
  }
  /** @hidden */
  [inspect.custom]() {
    return betterConsoleLog(this);
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
