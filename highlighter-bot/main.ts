import { Client, Events, GatewayIntentBits, ActivityType } from 'discord.js';

import {
  loginToken,
  prefix,
  triggerName,
} from './constants';

import { handle as commandHandler} from './commandHandler';
import { handle as modalHandler } from './modalHandler';
import { deploy } from './deploy';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
});

client.login(loginToken).then(() => {
  client.user?.setPresence({
    status: 'online',
    afk: false,
    activities: [{
      name: `use "${prefix}${triggerName} | ${prefix}help"`,
      type: ActivityType.Playing,
    }],
  });
});

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  deploy();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isModalSubmit()) {
    modalHandler(interaction);
  } else {
    commandHandler(interaction);
  }
});
