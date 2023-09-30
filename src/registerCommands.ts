import { REST, Routes } from "discord.js";
import dotenv from "dotenv";

dotenv.config();
const TOKEN = process.env.DISCORD_TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;

const commands = [
	{
		name: "ping",
		description: "Replies with Pong!",
	},
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
	try {
		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
