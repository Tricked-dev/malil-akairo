import Command from "../Classes/SlashCommand";
import type { CommandInteraction } from "discord.js";
import { MessageAttachment } from "discord.js";
import c from "centra";

export default class fedoraCommand extends Command {
	constructor() {
		super("fedora", {
			name: "fedora",
			description: "fedora a user's avatar",
			options: [
				{
					type: 6,
					name: "user",
					description: "user to fedora",
					required: false,
				},
			],
		});
	}

	async exec(message: CommandInteraction) {
		const member = message.options[0]?.user ?? message.user;
		const res = await c(`https://api.dagpi.xyz/image/fedora/?url=${member.avatarURL({ dynamic: false, format: "png" })}`, "get")
			.header("Authorization", this.client.credentials.dagpi)
			.send();
		return message.reply({ content: "here ya go", files: [{ attachment: res.body, name: `Fedora'd.png` }] });
	}
}
