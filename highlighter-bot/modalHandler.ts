import { AttachmentBuilder, CacheType, Interaction } from "discord.js";
import { apiLocation, apiLocationHTML } from "./constants";
import axios from "axios";

const handle = async (interaction: Interaction<CacheType>) => {
  if (!interaction.isModalSubmit()) return;

  interaction.deferReply();

  const [language, quality, html] = interaction.customId.split('-');
  
  const code = interaction.fields.getTextInputValue('code');

  if (!language || !code) {
    interaction.reply({ content: 'Internal server error' });
    return;
  }

  const imagePromise = axios.post(
    apiLocation,
    {
      text: code,
      lang: language,
      quality,
    },
    { responseType: 'arraybuffer' },
  );

  const HTMLPromise = axios.post(apiLocationHTML, {
    text: code,
    lang: language,
    quality,
  });

  const [image, HTML] = await Promise.all([imagePromise, HTMLPromise]);

  const files = html === 'true'
    ? [(new AttachmentBuilder(Buffer.from(HTML.data), { name: 'generated.html' })), new AttachmentBuilder(Buffer.from(image.data), { name: 'image.png' })]
    : [new AttachmentBuilder(Buffer.from(image.data), { name: 'image.png' })];

  const timeTaken = Date.now() - interaction.createdTimestamp;

  interaction.editReply({ content: `Request completed with latency of ${timeTaken}ms.`, files: files });
};

export {
  handle,
};
