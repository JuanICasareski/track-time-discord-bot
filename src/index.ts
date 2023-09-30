import dotenv from 'dotenv';
import { client } from './utils/discord';
import { write_user_state } from './utils/files';


dotenv.config();
const TOKEN = process.env.DISCORD_TOKEN;


client.on('ready', async (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on('voiceStateUpdate', (old_state, new_state) => {
  if (old_state.channel && !new_state.channel ) {
    console.log(`[-] ${new_state.member?.user?.displayName}`);

    if (new_state.member?.user.id) {
      write_user_state(
        new_state.guild.id,
        new_state.member?.user.id,
        'disconnected'
      );
    }
  }
  else {
    console.log(`[+] ${new_state.member?.user?.displayName}`);

    if (new_state.member?.user.id) {
      write_user_state(
        new_state.guild.id,
        new_state.member?.user.id,
        'connected'
      );
    }
  }
});


client.login(TOKEN);
