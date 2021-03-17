import { Command } from "discord-akairo";
import { MessageEmbed, GuildChannel, TextChannel, GuildMember, Message } from "discord.js";
import { utc } from "moment";
import { GetMember, ms, Infract } from "../../lib/Utils";

export default class MuteCommand extends Command {
	public constructor() {
		super("mute", {
			aliases: ["mute", "tempmute", "muterole", "mutedrole"],
			category: "Moderation",
			description: {
				content: "To mute member on this guild",
				usage: "mute < member > ",
				example: ["mute @member"],
			},
			ratelimit: 3,

			clientPermissions: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
			userPermissions: ["MANAGE_MESSAGES", "MANAGE_ROLES"],
			channel: "guild",
			args: [
				{
					id: "Args",
					match: "rest",
					type: "string",
				},
			],
		});
	}

	public async exec(message: Message, { Args }: { Args: string }) {
		if (!Args) return message.reply("No user or role provided");
		const args = Args.split(" ");
		const alias = message.util.parsed.alias;
		if (alias == "muterole" || alias == "mutedrole") {
			const role = await message.guild.roles.fetch(Args);
			if (role?.id) {
				this.client.mutes.set(message.guild.id, role.id, "role");
				return message.reply("Muted role updated");
			} else {
				return message.reply("Role not found please provide a valid role id");
			}
		}
		this.client.mutes.ensure(message.guild.id, {
			role: null,
			mutes: {},
		});
		const role = this.client.mutes.get(message.guild.id, "role");
		console.log(args[0]);
		if (args[0] == "set" || args[0] == "role") {
			const role = await message.guild.roles.fetch(args[1]);
			if (role?.id) {
				this.client.mutes.set(message.guild.id, role.id, "role");
				return message.reply("Muted role updated");
			} else {
				return message.reply("Role not found please provide a valid role id");
			}
		}
		if (!role) return message.reply("No role setup use @malil muterole <your mute role>, to setup mutes");
		if (!Args && role) return message.reply("Please provide a user and a time");

		/**GETTING THE TIME*/
		let time: number;
		try {
			time = ms(args[1]);
			if (!time) {
				time = ms(args[0]);
				if (!time) return message.reply("please provide a valid time");
			}
		} catch (e) {
			return message.reply("Thats not a valid amount of time");
		}
		if (time > 604800001) return message.reply("Cant mute longer than 7 days");
		if (time < 59090) return message.reply("Sorry cant mute for less than one minute");
		let member: GuildMember;
		/**GETTING MEMBER*/
		member = await GetMember(message, args[0]);
		if (!member) {
			member = await GetMember(message, args[1]);
			if (!member) return message.reply("please provide a valid time");
		}
		const endtime = time + Date.now();
		const ENDS = endtime - Date.now();
		this.client.emit("mute", member, ENDS);
		const mutes = this.client.mutes.get(message.guild.id, "mutes");
		mutes[member.user.id] = endtime;
		this.client.mutes.set(message.guild.id, mutes, "mutes");
		const _time = time.toString();
		Infract(message, _time, member, "MUTE", this.client);
	}
}