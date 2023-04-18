import { Command } from '../commandHandler';
import { SlashCommandBuilder } from 'discord.js';
import { helpMessage } from '../constants';

const commandInfo = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show help info')
;

const commandFunction: Command['function'] = async (interaction) => {
  if (interaction.isRepliable() && interaction.isCommand() && interaction.isChatInputCommand()) {
    await interaction.reply(helpMessage);
  }
};

export {
  commandInfo,
  commandFunction,
};
