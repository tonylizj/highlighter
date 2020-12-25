import Discord from 'discord.js';
import fs from 'fs';
import request from 'request';
import dotenv from 'dotenv';

dotenv.config();

const client = new Discord.Client();
client.login(process.env.BOT_TOKEN).then(() => {
  client.user!.setPresence({
    status: 'online',
    afk: false,
    activity: {
      name: 'use "/hl help"',
      type: 'PLAYING',
    },
  });
});

const prefix = '/';
const triggerName = 'hl';
const langList = ['typescript', 'c', 'cpp', 'csharp', 'python', 'java', 'go', 'julia', 'kotlin', 'haskell', 'lisp', 'lua', 'makefile', 'markdown', 'matlab', 'mongodb', 'objectivec', 'pascal', 'perl', 'php', 'r', 'racket', 'ruby', 'rust', 'scala', 'scheme', 'swift', 'visual-basic', 'json', 'latex', 'graphql', 'docker', 'markup', 'css', 'clike', 'javascript'];
const qualityList = ['medium', 'high', 'extreme'];
const usage = `Use "${prefix}${triggerName} help" for usage`;
const apiLocation = 'https://highlighter-api.herokuapp.com/';

client.on('message', async (userMessage) => {
  if (userMessage.author.bot) return;
  if (!userMessage.content.startsWith(prefix)) return;
  let commandBody = userMessage.content.slice(prefix.length);
  commandBody = commandBody.trim();
  let args = commandBody.split(/\s+/);
  const shifted = args.shift();
  if (shifted === undefined) {
    console.log(`error: ${userMessage}`);
    return;
  }
  const command = shifted.toLowerCase();

  if (command === 'highlighter' || command === 'highlight') {
    userMessage.channel.send(usage);
    return;
  }

  if (command.split('_')[0] === triggerName) {
    const splitCommand = command/* .split('\n')[0] */.split('_');

    args = commandBody.substring(command.length, commandBody.length).trim().split(' ');
    console.log(args);

    if (args.length === 1 && args[0] === 'help') {
      userMessage.channel.send(`\`\`\`
Usage: "${prefix}${triggerName}_<language>_<quality> <your code here>" where <language> is the language of your code, <quality> is one of medium, high, extreme.
Failing to specify the above arguments will result in highlighter defaulting to typescript and medium.
See https://highlighter-api.herokuapp.com/ for list of supported languages.

Github: https://github.com/tonylizj/highlighter
\`\`\``);
      return;
    }

    if (args.length === 1 && args[0] === 'flower') {
      userMessage.channel.send('https://play.google.com/store/apps/details?id=com.flowerid');
      return;
    }

    let useDefault = false;

    if (splitCommand.length === 1) {
      userMessage.channel.send(`Arguments not given. Use "${prefix}${triggerName} help for usage" if unintentional. Defaulting to typescript and medium...`);
      useDefault = true;
    }

    if (splitCommand.length > 3) {
      userMessage.channel.send(`Too many arguments given. ${usage}`);
      return;
    }

    if (!useDefault && !langList.includes(splitCommand[1])) {
      userMessage.channel.send(`Incorrect language specified as first argument. ${usage}`);
      return;
    }

    const language = useDefault ? 'typescript' : splitCommand[1];

    if (!useDefault && !qualityList.includes(splitCommand[2])) {
      userMessage.channel.send(`Incorrect quality specified as second argument. ${usage}`);
      return;
    }

    const qualityArg = useDefault ? 'medium' : splitCommand[2];

    if (args.length === 0) {
      userMessage.channel.send(`No code given. ${usage}`);
      return;
    }

    const receivedMessage = userMessage.channel.send(`Request received. Calling highlighter API at ${apiLocation}...`);
    const file = fs.createWriteStream('out.png');
    request.post(apiLocation, {
      form: {
        text: args.join(' '),
        lang: language,
        quality: qualityArg,
      },
    }).pipe(file);
    file.on('close', async () => {
      const timeTaken = Date.now() - userMessage.createdTimestamp;
      userMessage.reply(`request finished. This request had a latency of ${timeTaken}ms and was made using language: ${language} and quality: ${qualityArg}.`, {
        files: ['./out.png'],
      });
      userMessage.delete();
      (await receivedMessage).delete();
    });
  }
});
