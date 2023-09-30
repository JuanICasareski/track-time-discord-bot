import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();
const TOKEN = process.env.DISCORD_TOKEN


const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildVoiceStates, 
  GatewayIntentBits.GuildModeration
]});

client.on('ready', async (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.channel && !newState.channel ) {
    console.log(`[-] ${newState.member?.user?.displayName}`)
  } 
  else {
    console.log(`[+] ${newState.member?.user?.displayName}`)
  }
})



client.login(TOKEN);
