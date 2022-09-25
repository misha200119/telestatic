// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://guthub.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published. 

//import {Telestatic,GramJs,Composer,Updates} from "../src"
import {Telestatic,GramJs} from "../src/"
import * as Medias from "../src/Utils/Medias"
import fs from "fs"
import path from "path"
interface MyContext {
  hello?:string
}
const bot = new Telestatic()
bot.log.setLogLevel("debug")
bot.on("message",console.log)
bot.run()