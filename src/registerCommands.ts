import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { commands } from "./utils/constants"

dotenv.config();
const TOKEN = process.env.DISCORD_TOKEN || '';
const CLIENT_ID = process.env.CLIENT_ID || '';

const cmds = [
	{
		name: commands.PING,
		description: "Contesta Pong!",
	},
	{
		name: commands.LEADERBOARD,
		description: "Muestra el ranking de uso del discord para este servidor"
	}
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
	try {
		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: cmds });

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
