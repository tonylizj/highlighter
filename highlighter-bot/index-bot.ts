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
const apiLocationHTML = `${apiLocation}downloadHTML`;
const helpMessage = `\`\`\`
Usage: "${prefix}${triggerName}_language_quality code" where language is the language of your code, quality is one of: medium, high, extreme.
If only one argument is given, it will be parsed as language.
If no argumentss are given, highlighter will default to typescript and medium.

Examples:
/hl const a = 3;

/hl_python_high print(range(8)[2])

/hl_cpp
if (winner == nullptr) {
  prop->setMortgaged(0);
  auto ac = dynamic_pointer_cast<AcademicBuilding>(prop);
  if (ac != nullptr) {
      ac->setNumImpr(0);
  }
}

Supported languages: ['typescript', 'c', 'cpp', 'csharp', 'python', 'java', 'go', 'julia', 'kotlin', 'haskell', 'lisp', 'lua', 'makefile', 'markdown', 'matlab', 'mongodb', 'objectivec', 'pascal', 'perl', 'php', 'r', 'racket', 'ruby', 'rust', 'scala', 'scheme', 'swift', 'visual-basic', 'json', 'latex', 'graphql', 'docker', 'markup', 'css', 'clike', 'javascript']

Github: https://github.com/tonylizj/highlighter\`\`\``;
const FlowerIDUrl = 'https://play.google.com/store/apps/details?id=com.flowerid';

interface POSTParams {
  codeArray: string[];
  language: string;
  qualityArg: string;
}

const generatePOSTParams = (
  command: string,
  commandBody: string,
  userMessage: Discord.Message,
): POSTParams | null => {
  const splitCommand = command/* .split('\n')[0] */.split('_');

  const codeArray = commandBody.substring(command.length, commandBody.length).trim().split(' ');

  if (codeArray.length === 1 && codeArray[0] === 'help') {
    userMessage.channel.send(helpMessage);
    return null;
  }

  if (codeArray.length === 1 && codeArray[0] === 'helpNoCredit') {
    userMessage.channel.send(`${helpMessage.split('\n').slice(0, -1).join('\n')}\`\`\``);
    userMessage.delete();
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
    msg.then((x) => setTimeout(() => x.delete(), 5000));
    useDefault = true;
    useDefaultQuality = true;
  }

  if (splitCommand.length === 2) {
    const msg = userMessage.channel.send(`Only 1 argument given. This will be parsed as language. Use "${prefix}${triggerName} help for usage" if unintentional. Defaulting to medium...`);
    msg.then((x) => setTimeout(() => x.delete(), 5000));
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

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ],
});

client.login(testingMode ? process.env.BOT_TOKEN_HL_TESTING : process.env.BOT_TOKEN_HL).then(() => {
  client.user!.setPresence({
    status: 'online',
    afk: false,
    activities: [{
      name: `use "${prefix}${triggerName} help"`,
      type: 'PLAYING',
    }],
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

  if (command.split('_')[0] === triggerName || command.split('_')[0] === `${triggerName}-text`) {
    const ret = generatePOSTParams(command, commandBody, userMessage);

    if (ret === null) {
      return;
    }

    const sendText = command.split('_')[0] === `${triggerName}-text`;

    const { codeArray, language, qualityArg } = ret;

    const receivedMessage = userMessage.channel.send(`Request received. Calling highlighter API at ${apiLocation}...`);

    const imagePromise = axios.post(
      apiLocation,
      {
        text: codeArray.join(' '),
        lang: language,
        quality: qualityArg,
      },
      { responseType: 'arraybuffer' },
    );

    const HTMLPromise = axios.post(apiLocationHTML, {
      text: codeArray.join(' '),
      lang: language,
      quality: qualityArg,
    });

    const [image, HTML] = await Promise.all([imagePromise, HTMLPromise]);

    const timeTaken = Date.now() - userMessage.createdTimestamp;

    const files = sendText ? [(new Discord.MessageAttachment(Buffer.from(HTML.data), 'generated.html')), new Discord.MessageAttachment(Buffer.from(image.data), 'image.png')] : [new Discord.MessageAttachment(Buffer.from(image.data), 'image.png')];

    await userMessage.reply({
      content: `Request completed. This request had a latency of ${timeTaken}ms and was made using language: ${language} and quality: ${qualityArg}.`,
      files,
    });
    (await receivedMessage).delete();
  }
});
