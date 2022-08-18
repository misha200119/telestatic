// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.

import { Api } from 'telegram';
import { Telestatic } from '../../Client';
import bigInt from 'big-integer';
import BotError from '../../Context/Error';

export async function AnswerPrecheckoutQuery(
  telestaticClient: Telestatic,
  id: bigint,
  ok: boolean,
  error?: string
) {
  try {
    return await telestaticClient.client.invoke(
      new Api.messages.SetBotPrecheckoutResults({
        success: ok,
        queryId: bigInt(String(id)),
        error: error,
      })
    );
  } catch (error: any) {
    telestaticClient.log.error('Failed running telegram.answerPrecheckoutQuery');
    throw new BotError(
      error.message,
      'telegram.answerPrecheckoutQuery',
      `${id},${ok}${error ? `,${error}` : ''}`
    );
  }
}
