// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://github.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import BotError from '../Context/Error';
import { TypeUpdate } from '../Update';
export interface CatchError {
  (error: BotError, ctx: TypeUpdate);
}
