import Discord from 'discord.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const testingMode = false;

const prefix = '/';
const triggerName = testingMode ? 'hl-t' : 'hl';
const langList = ['typescript', 'c', 'cpp', 'csharp', 'python', 'java', 'go', 'julia', 'kotlin', 'haskell', 'lisp', 'lua', 'makefile', 'markdown', 'matlab', 'mongodb', 'objectivec', 'pascal', 'perl', 'php', 'r', 'racket', 'ruby', 'rust', 'scala', 'scheme', 'swift', 'visual-basic', 'json', 'latex', 'graphql', 'docker', 'markup', 'css', 'clike', 'javascript'];
const qualityList = ['medium', 'high', 'extreme'];
const usage = `Use "${prefix}${triggerName} help" for usage`;
const apiLocation = testingMode ? 'http://localhost:5000/' : 'https://highlighter-api.herokuapp.com/';
const apiLocationHTML = `${apiLocation}/downloadHTML`;
const helpMessage = `\`\`\`
Usage: "${prefix}${triggerName}_<language>_<quality> <your code here>" where <language> is the language of your code, <quality> is one of medium, high, extreme.
Failing to specify the above arguments will result in highlighter defaulting to typescript and medium.
If only one argument is given, it will be parsed as <language>.
See https://highlighter-api.herokuapp.com/ for list of supported languages.

Github: https://github.com/tonylizj/highlighter
\`\`\``;
const FlowerIDUrl = 'https://play.google.com/store/apps/details?id=com.flowerid';

interface POSTParams {
  codeArray: string[];
  language: string;
  qualityArg: string;
}

const generatePOSTParams = (
  command: string, commandBody: string, userMessage: Discord.Message,
): POSTParams | null => {
  const splitCommand = command/* .split('\n')[0] */.split('_');

  const codeArray = commandBody.substring(command.length, commandBody.length).trim().split(' ');

  if (codeArray.length === 1 && codeArray[0] === 'help') {
    userMessage.channel.send(helpMessage);
    return null;
  }

  if (codeArray.length === 1 && codeArray[0] === 'flower') {
    userMessage.channel.send(FlowerIDUrl);
    return null;
  }

  let useDefault = false;
  let useDefaultQuality = false;

  if (splitCommand.length === 1) {
    const msg = userMessage.channel.send(`Arguments not given. ${usage} if unintentional. Defaulting to typescript and medium...`);
    msg.then((x) => x.delete({ timeout: 5000 }));
    useDefault = true;
    useDefaultQuality = true;
  }

  if (splitCommand.length === 2) {
    const msg = userMessage.channel.send(`Only 1 argument given. This will be parsed as language. Use "${prefix}${triggerName} help for usage" if unintentional. Defaulting to medium...`);
    msg.then((x) => x.delete({ timeout: 5000 }));
    useDefaultQuality = true;
  }

  if (splitCommand.length > 3) {
    userMessage.channel.send(`Too many arguments given. ${usage}`);
    return null;
  }

  if (!useDefault && !langList.includes(splitCommand[1])) {
    userMessage.channel.send(`Incorrect language specified as first argument. ${usage}`);
    return null;
  }

  const language = useDefault ? 'typescript' : splitCommand[1];

  if (!useDefault && !useDefaultQuality && !qualityList.includes(splitCommand[2])) {
    userMessage.channel.send(`Incorrect quality specified as second argument. ${usage}`);
    return null;
  }

  const qualityArg = useDefaultQuality ? 'medium' : splitCommand[2];

  if (codeArray.length === 0 || (codeArray.length === 1 && codeArray[0] === '')) {
    userMessage.channel.send(`No code given. ${usage}`);
    return null;
  }

  return { codeArray, language, qualityArg };
};

const client = new Discord.Client();

client.login(testingMode ? process.env.BOT_TOKEN_TESTING : process.env.BOT_TOKEN).then(() => {
  client.user!.setPresence({
    status: 'online',
    afk: false,
    activity: {
      name: `use "${prefix}${triggerName} help"`,
      type: 'PLAYING',
    },
  });
});

client.on('message', async (userMessage) => {
  if (userMessage.author.bot) return;
  if (!userMessage.content.startsWith(prefix)) return;
  let commandBody = userMessage.content.slice(prefix.length);
  commandBody = commandBody.trim();
  const args = commandBody.split(/\s+/);
  const shifted = args.shift();
  if (shifted === undefined) {
    return;
  }
  const command = shifted.toLowerCase();

  if (command === 'highlighter' || command === 'highlight') {
    userMessage.channel.send(usage);
    return;
  }

  if (command.split('_')[0] === triggerName) {
    const ret = generatePOSTParams(
      command, commandBody, userMessage,
    );

    if (ret === null) {
      return;
    }

    const { codeArray, language, qualityArg } = ret;

    const receivedMessage = userMessage.channel.send(`Request received. Calling highlighter API at ${apiLocation}...`);

    const imagePromise = axios.post(apiLocation, {
      text: codeArray.join(' '),
      lang: language,
      quality: qualityArg,
    },
    { responseType: 'arraybuffer' });

    const HTMLPromise = axios.post(apiLocationHTML, {
      text: codeArray.join(' '),
      lang: language,
      quality: qualityArg,
    });

    const [image, HTML] = await Promise.all([imagePromise, HTMLPromise]);

    const timeTaken = Date.now() - userMessage.createdTimestamp;
    userMessage.reply(`request completed. This request had a latency of ${timeTaken}ms and was made using language: ${language} and quality: ${qualityArg}.`,
      [new Discord.MessageAttachment(Buffer.from(HTML.data), 'generated.html'), new Discord.MessageAttachment(Buffer.from(image.data), 'image.png')],
    ); // eslint-disable-line
    userMessage.delete();
    (await receivedMessage).delete();
  }
});
