import dotenv from 'dotenv';
import { client } from './utils/discord';
import { write_user_state, get_users_state } from './utils/files';
import { EmbedBuilder } from '@discordjs/builders';
import { commands } from './utils/constants';

dotenv.config();
const TOKEN = process.env.DISCORD_TOKEN;


client.on('ready', async (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === commands.PING) {
    await interaction.reply('Pong!');
  }

  else if (interaction.commandName === commands.LEADERBOARD) {
    if (interaction.guildId) {
      await interaction.deferReply();
      
      const leader_board = new EmbedBuilder()
        .setTitle("Top horas en Discord")
      
      const states = await get_users_state(interaction.guildId)

      const description = states.map((user, i) => (
        `**__#${i+1}__ [${user.nickname}]** ${user.formatted_total_time}`
      ))

      leader_board.setDescription("No hay leaderboard");  
      if (description.length) {
        leader_board.setDescription(description.join('\n'));
      }
      
      await interaction.editReply({embeds: [leader_board]})
    }
  }
});

client.on('voiceStateUpdate', async (old_state, new_state) => {
  if (old_state.channel && !new_state.channel ) {
    console.log(`[-] ${new_state.member?.user?.displayName}`);

    if (new_state.member?.user.id) {
      await write_user_state(
        new_state.guild.id,
        new_state.member.user.id,
        'disconnected'
      );
    }
  }
  else {
    console.log(`[+] ${new_state.member?.user?.displayName}`);

    if (new_state.member?.user.id) {
      await write_user_state(
        new_state.guild.id,
        new_state.member.user.id,
        'connected'
      );
    }
  }
});


client.login(TOKEN);
