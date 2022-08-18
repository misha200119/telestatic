

<p align="center">

  <img width="400" src="https://img.freepik.com/premium-vector/a-white-paper-airplane-flies-in-the-sky-with-clouds-copy-space-vector-illustration_297535-3084.jpg" alt="Telestatic performance">

<p>

<h1 align="center">🛫 Telestatic</h1>

<h4 align="center">Telegram MTProto framework for NodeJS</h4>

> 🚧 DEVELOPMENT! <br/> 
> Development is in full swing, wait for the results.

## 🔑 Installation (not fully)

• From NPM:

```
npm install telestatic@latest

```

• From YARN:

```
yarn add telestatic@latest

```

## 🔌 Usage (not all!)
•  Welcome UserBot 
```
const { Telestatic } = require('telestatic');
/* or 
 import { Telestatic } from 'telestatic';
*/

const bot = new Telestatic({
  apiHash : 'hash' , /* if you need a UserBot, paste your api hash, and api id from my.telegram.org */
  apiId : 123456, // your api id
  botToken : 'token' /* if you need a Bot, paste bot token from @BotFather, REMOVE IF YOU NEED A UserBot */ 
})

bot.run(); // telestatic running

bot.on("message",(ctx)=>{ // handle new message event.
  ctx.reply("Hello World") // reply with "Hello World"
  //console.log(ctx) // see json of message.
});

bot.hears('hi', (ctx) => { // handle the message with the required text
    ctx.reply('Oh, hello!');
});

```
## 📁 Documentation (COMMING SOON) (not fully)

All documentation on methods, requests, and additional information is on the **[TELESTATIC](telestatic.github.io)**.

## 📃 License 

This information is distributed for informational purposes. We are not trying to offend anyone. For more information go to the file **[LICENSE](https://github.com/spelsinx/telestatic/blob/main/LICENSE)**. 
