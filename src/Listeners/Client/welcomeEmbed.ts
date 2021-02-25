
import { Listener } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { GuildMember, TextChannel } from 'discord.js'
import Client from '../../client/Client';
import { main, sec, third, fourth, a1, split, sleep } from "../../lib/Utils"
export default class WelcomeEmbed extends Listener {
    client: Client
    public constructor(client: Client) {
        super("welcomeEmbed", {
            emitter: "client",
            event: "guildMemberAdd",
            category: "client"
        });
        this.client = client
    }

    async exec(member: GuildMember) {
        if (this.client.setting.dev == false) {
            if (member.guild.id == "748956745409232945") {
                let gifs = [
                    "https://i.imgur.com/MqGBqZs.gif",
                    "https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif",
                    "https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif",
                    "https://media.giphy.com/media/Cmr1OMJ2FN0B2/giphy.gif"
                ]
                gifs = shuffle(gifs)
                const welcomeEmbed = new MessageEmbed()
                    .setColor(this.client.setting.colors.green)
                    .addField("Welcome " + member.user.tag, "hope you enjoy the stay")
                    .setImage(gifs[Math.floor(Math.random() * gifs.length)])
                const channel = await this.client.channels.fetch("748970525245702174")
                const role = member.guild.roles.cache.get("748967146498818058");
                member.roles.add(role)
                const webhook = await (channel as TextChannel)
                    .createWebhook(member.user.tag)
                    .then((webhook) => webhook.edit({ avatar: member.user.displayAvatarURL({ size: 2048, format: "png" }) }));
                await webhook
                    .send(welcomeEmbed)
                    .then(() => webhook.delete())
                    .catch(() => this.client.logger.info(fourth("Webhook messed up :(")));
            }
        }
    }
}
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}