import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";
import { main, sec, fourth, a1 } from "../../lib/Utils";
import Client from "../../lib/Client";

export default class CommandStarted extends Listener {
	client: Client;
	public constructor(client: Client) {
		super("commandStarted", {
			emitter: "commandHandler",
			event: "commandStarted",
			category: "commandHandler",
		});
		this.client = client;
	}

	exec(message: Message, command: Command): void {
		this.client.gp.math("commands", "+", 1);
		const cmd = main(command);
		const usr = sec(message.author.tag) + " " + fourth(message.author.id);
		const gld = sec(message.guild.name) + " " + fourth(message.guild.id);
		this.client.logger.info(a1("[ COMMAND RAN ] ") + cmd + a1(" [ USER ] ") + usr + a1(" [ GUILD ] ") + gld);
	}
}
