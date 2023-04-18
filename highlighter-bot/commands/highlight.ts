import { Command } from '../commandHandler';
import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { triggerName } from '../constants';

const commandInfo = new SlashCommandBuilder()
  .setName(triggerName)
  .setDescription('Syntax highlight code')
  .addStringOption(option =>
    option.setName('language')
      .setDescription('Language that the code is in')
      .setRequired(true)
      .addChoices(
        { name: 'C', value: 'c' },
        { name: 'C++', value: 'cpp' },
        { name: 'C#', value: 'csharp' },
        { name: 'Docker', value: 'docker' },
        { name: 'Go', value: 'go' },
        { name: 'Haskell', value: 'haskell' },
        { name: 'Java', value: 'java' },
        { name: 'Julia', value: 'julia' },
        { name: 'Kotlin', value: 'kotlin' },
        { name: 'LaTeX', value: 'latex' },
        { name: 'Lisp', value: 'lisp' },
        { name: 'Lua', value: 'lua' },
        { name: 'Makefile', value: 'makefile' },
        { name: 'Matlab', value: 'matlab' },
        { name: 'Objective-C', value: 'objectivec' },
        { name: 'PHP', value: 'php' },
        { name: 'Python', value: 'python' },
        { name: 'R', value: 'r' },
        { name: 'Racket', value: 'racket' },
        { name: 'Ruby', value: 'ruby' },
        { name: 'Rust', value: 'rust' },
        { name: 'Scala', value: 'scala' },
        { name: 'Scheme', value: 'scheme' },
        { name: 'Swift', value: 'swift' },
        { name: 'TypeScript', value: 'typescript' },
      )
  )
  .addStringOption(option =>
    option.setName('quality')
      .setDescription('Image quality of the output, higher quality results in lower character count cap, default is Medium')
      .setRequired(false)
      .addChoices(
        { name: 'Medium', value: 'medium' },
        { name: 'High', value: 'high' },
        { name: 'Extreme', value: 'extreme' },
      )
  )
  .addBooleanOption(option =>
    option.setName('html')
      .setDescription('Whether to return an HTML file for selecting and copying along with the image, default is false')
      .setRequired(false)
  )
;

const commandFunction: Command['function'] = async (interaction) => {
  if (interaction.isRepliable() && interaction.isCommand() && interaction.isChatInputCommand()) {
    const language = interaction.options.getString('language');
    const quality = interaction.options.getString('quality') ?? 'medium';
    const html = interaction.options.getBoolean('html') ?? false;
    const modal = new ModalBuilder()
      .setTitle('highlighter')
      .setCustomId(`${language}-${quality}-${html}`);

    const codeInput = new TextInputBuilder()
      .setCustomId('code')
      .setLabel("Enter your code here")
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(codeInput);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }
};

export {
  commandInfo,
  commandFunction,
};
