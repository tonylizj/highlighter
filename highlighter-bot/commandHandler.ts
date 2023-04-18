import { SlashCommandBuilder, Interaction, CacheType, Collection } from 'discord.js';
import { commandInfo as highlightCommandInfo, commandFunction as highlightCommandFunction } from './commands/highlight';
import { commandInfo as helpCommandInfo, commandFunction as helpCommandFunction } from './commands/help';

type Command = {
  info: SlashCommandBuilder;
  function: (interaction: Interaction<CacheType>) => void;
};

const commands = new Collection<string, Command['function']>();

commands.set(highlightCommandInfo.name, highlightCommandFunction);
commands.set(helpCommandInfo.name, helpCommandFunction);

const handle = async (interaction: Interaction<CacheType>) => {
  if (!interaction.isChatInputCommand()) return;
  commands.get(interaction.commandName)?.(interaction);
};

export {
  Command,
  handle,
};
