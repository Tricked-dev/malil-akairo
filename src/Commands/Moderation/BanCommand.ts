import { Listener } from 'discord-akairo';
import { Command } from 'discord-akairo';
import {
	Message,
	GuildMember,
	MessageEmbed,
	GuildChannel,
	TextChannel,
} from 'discord.js';
import { utc } from 'moment';
import { GetMember  } from '../../lib/Utils';
export default class BanCommand extends Command {
	public constructor() {
		super('ban', {
			aliases: ['ban'],
			category: 'Moderation',
			description: {
				content: 'To ban members on this guild',
				usage: 'ban < member >',
				example: ['ban @member', 'ban @member 7'],
			},
			channel: 'guild',
			ratelimit: 3,
			clientPermissions: ['BAN_MEMBERS', 'SEND_MESSAGES'],
			userPermissions: ['BAN_MEMBERS'],
			args: [
				{
					id: 'day',
					type: (_: Message, str: string): null | number => {
						if (
							str &&
							!isNaN(Number(str)) &&
							[0, 1, 2, 3, 4, 5, 7].includes(Number(str))
						)
							return Number(str);
						return null;
					},
					default: 0,
				},
				{
					id: 'reason',
					type: 'strin',
					default: 'e No reason provided...',
				},
			],
		});
	}

	public async exec(
		message: Message,
		{ day, reason }: { user: GuildMember; day: number; reason: string }
	) {

		const user = await GetMember(message, reason);
		if (!user) return message.reply('user not found');
		reason = reason.split(" ").slice(1).join(" ")
		if (!user.bannable)
			return message.channel.send(`Sorry, i can't ban this user`);

		try {
			await user.send(
				`You has been banned from **${message.guild.name} for reason: \`${reason}\``
			);
		} catch (err) {}

		await message.guild.members.ban(user, { days: day, reason });

		message.util.send(
			new MessageEmbed()
				.setAuthor(
					`User Banned by ${message.author.tag}`,
					message.author.avatarURL()
				)
				.setThumbnail(user.user.avatarURL())
				.setDescription(
					`
                Name: ${user.user.tag}
                Time: ${utc(Date.now())}
                Reason: ${reason}`
				)
				.setFooter(`Sayonara~`)
				.setTimestamp()
		);
		this.client.infractions.ensure(message.guild.id, {});

		const usID = (user as GuildMember).id;
		//* ------------------------------------ infraction code */
		this.client.infractions.ensure(message.guild.id, { [usID]: {} });
		const infraction = this.client.infractions.get(message.guild.id, usID);
		const riw = {
			who: message.author.tag,
			reason: reason,
			type: 'Ban',
		};
		infraction[Date.now()] = riw;
		this.client.infractions.set(message.guild.id, infraction, usID);

		if (this.client.logchannel.get(message.guild.id)) {
			if (
				((await this.client.channels.fetch(
					this.client.logchannel.get(message.guild.id)
				)) as GuildChannel).deleted == false
			) {
				const embed = new MessageEmbed()
					.setAuthor(
						`User Banned by ${message.author.tag}`,
						message.author.avatarURL()
					)
					.setDescription(`Member: ${user.user.tag}\nReason ${reason}`)
					.setColor(this.client.consts.colors.red)
					.setTimestamp();
				((await this.client.channels.fetch(
					this.client.logchannel.get(message.guild.id)
				)) as TextChannel).send(embed);
			}
		}
	}
}
