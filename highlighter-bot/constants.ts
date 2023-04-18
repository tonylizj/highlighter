import dotenv from 'dotenv';

dotenv.config();

const PROD = process.env.PROD ? process.env.PROD === 'true' : false;

const loginToken = PROD ? process.env.BOT_TOKEN_HL : process.env.BOT_TOKEN_HL_TESTING;
const appID = PROD ? process.env.APP_ID_HL : process.env.APP_ID_HL_TESTING;
const prefix = '/';
const triggerName = PROD ? 'hl' : 'hl-t';
const apiLocation = PROD ? 'https://highlighter-api.herokuapp.com/' : 'http://localhost:5000/';
const apiLocationHTML = `${apiLocation}downloadHTML`;
const helpMessage = `\`\`\`
Usage: "${prefix}${triggerName}".

The language that the code is written in must be specified. Certain character limits apply depending on image quality. When html is set to true, an HTML file will be returned along with the image for ease of text manipulation.

Github: https://github.com/tonylizj/highlighter\`\`\``;

export { 
  loginToken,
  appID,
  prefix,
  triggerName,
  apiLocation,
  apiLocationHTML,
  helpMessage,
};
