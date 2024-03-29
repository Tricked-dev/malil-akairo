import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class SecretCommand extends Command {
	public constructor() {
		super("secret", {
			aliases: ["secret"],
			category: "Developer",
			description: {
				content: "why Would you care",
				usage: "E",
				example: ["R"],
			},
			ratelimit: 3,
			clientPermissions: ["SEND_MESSAGES"],
			ownerOnly: false,
			channel: "guild",
		});
	}

	public async exec(message: Message, { code }) {
		message.util.send("woah you found my  secret command", { allowedMentions: { repliedUser: false } });
	}
}
