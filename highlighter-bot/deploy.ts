import { REST, Routes } from 'discord.js';

import { loginToken, appID } from './constants';
import { commandInfo as highlightCommandInfo } from './commands/highlight';
import { commandInfo as helpCommandInfo } from './commands/help';

const deploy = () => {
  if (!loginToken || !appID) return;

  const commands = [];
  
  commands.push(highlightCommandInfo.toJSON());
  commands.push(helpCommandInfo.toJSON());
  
  const rest = new REST().setToken(loginToken);
  
  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);
  
      const data = await rest.put(
        Routes.applicationCommands(appID),
        { body: commands },
      );
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  })();
}

export {
  deploy
};
