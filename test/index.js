// Tgtelestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/spelsinx>
//
// This file is part of Tgtelestatic
//
// Tgtelestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

const {Telestatic,GramJs} = require("../lib")
const bigInt = require("big-integer")
const bot = new Telestatic()
bot.log.setLogLevel("debug")
bot.command("start",async (ctx) => {
  const msg = await ctx.reply("123456")
  await ctx.telegram.editMessage(ctx.chat.id,msg.message.id,"**78901**234",{
    parseMode : "markdown"
    /*entities : [{
      type : "bold",
      offset : 0,
      length : 4
    }]*/
  })
})
bot.run()