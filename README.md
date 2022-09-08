

<p align="center">

  <img width="400" src="https://img.freepik.com/premium-vector/a-white-paper-airplane-flies-in-the-sky-with-clouds-copy-space-vector-illustration_297535-3084.jpg" alt="Telestatic performance">

<p>

<h1 align="center">🛫 Telestatic</h1>

<h4 align="center">Telegram MTProto framework for NodeJS</h4>

> 🚧 DEVELOPMENT! <br/> 
> Development is in full swing, wait for the results.

## 🔑 Installation (not fully)

• From NPM:

```cmd
npm install telestatic@latest

```

• From YARN:

```cmd
yarn add telestatic@latest

```

## 🔌 Usage (not all!)
•  Welcome UserBot 
```js
const { Telestatic } = require('telestatic'); // importing module
/* or 
 import { Telestatic } from 'telestatic';
*/

const bot = new Telestatic({
    apiHash: 'paste here', // get it from my.telegram.org
    apiId: 1234, // get it from my.telegram.org
    // botToken : 'token' /* if you need a Bot, paste bot token from @BotFather */ 
});
bot.run(); // running client.
bot.hears('hi', (ctx) => {
    ctx.reply('Ohh, hello!');
});

```
## 📁 Documentation (COMMING SOON) (not fully)

All documentation on methods, requests, and additional information is on the **[TELESTATIC](telestatic.js.org)**.

## 📃 License 

This information is distributed for informational purposes. We are not trying to offend anyone. For more information go to the file **[LICENSE](https://github.com/spelsinx/telestatic/blob/main/LICENSE)**. 
