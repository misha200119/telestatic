/**
 * example config file. (telestatic.config.js)
 * You don't have to create this file. You can put options in ``new Telestatic({options})``
*/
module.exports = {
    /**
   * Set Logger level for gramjs. Default is "none".
  */
  logger: "none",
  /**
   * An api_hash got from my.telegram.org
  */
  apiHash: "your api hash here.",
  /**
   * An api_id got from my.telegram.org
  */
  apiId: 123456,
  /**
   * String sessions. 
   * if you have the string sessions you can fill this. if not you can fill with blank string.
  */
  session: "",
  /**
   * Bot Token from botFather. If you need to login as bot this required. 
   * if you need login with user, delete this.
  */
  botToken: "paste you bot token in here.",
  /**
   * Connection Retries for gramjs. Default is 5.
  */
  connectionRetries: 5,
  /**
   * telestatic console.log 
   * If set, telestatic will showing the message in console like welcome to telestatic or anything.
  */
  tgTelestaticLog: true,
  /**
   * session name 
   * required to save the string session.
  */
  sessionName: "telestatic",
  /**
   * storeSession 
   * required to save the session in storage.
  */
  storeSession: true
};