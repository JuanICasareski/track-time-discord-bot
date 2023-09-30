import { Client, GatewayIntentBits } from 'discord.js';

export const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildVoiceStates
]});

export const get_user = async (guild_id: string, user_id: string) => {
    const guild = await client.guilds.fetch(guild_id);
    const member = await guild.members.fetch(user_id);

    return member;
}