import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";
import centra from "centra"
export default class BotListCommand extends Command {
    public constructor() {
        super("botList", {
            aliases: ["botList"],
            category: "Developer",
            quoted: true,
            args: [
                {
                    id: "args",
                    type: "array",
                    match: "rest",
                }
            ],
            description: {
                content: "",
                usage: "botList",
                example: [
                    "botList"
                ]
            },
            ratelimit: 3,
            ownerOnly: true,
            channel: "guild"
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public async exec(message: Message, { args }) {

        this.client.logger.info("[ POSTING TO BOT SITES ]")
        const topgg = {
            "server_count": this.client.guilds.cache.size,
            "shard_count": this.client.shard.ids.length,
            "shard_id": this.client.shard.ids[0]
        }
        try {
            const res = await centra("https://top.gg/api/bots/749020331187896410/stats", "post")
                .header("Authorization", this.client.setting.bottokens.topgg)
                .body(topgg)
                .send()
            console.log(res)
        } catch (err) { this.client.logger.info("[ COULD NOT POST TO TOPGG ]") }


        const discordbotlist = {
            "guilds": this.client.guilds.cache.size,
            "users": this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0),
            "shard_id": this.client.shard.ids[0]
        }
        try {
            const res = await centra("https://discordbotlist.com/api/v1/bots/749020331187896410/stats", "post")
                .header("Authorization", this.client.setting.bottokens.discordbotlist)
                .body(discordbotlist)
                .send()
            console.log(res)
        } catch (err) { this.client.logger.info("[ COULD NOT POST TO discordbotlist ]") }


        const bladebotlist = {
            "server_count": this.client.guilds.cache.size,
            "shardcount": this.client.shard.ids.length
        }
        try {
            const res = await centra("https://bladebotlist.xyz/api/bots/749020331187896410/stats", "post")
                .header("Authorization", this.client.setting.bottokens.Bladebnots)
                .body(bladebotlist)
                .send()
            console.log(res)
        } catch (err) { this.client.logger.info("[ COULD NOT POST TO bladebotlist ]") }



        const discordextremelist = {
            "guildCount": this.client.guilds.cache.size,
            "shardcount": this.client.shard.ids.length
        }
        try {
            const res = await centra("https://api.discordextremelist.xyz/v2/bot/749020331187896410/stats", "post")
                .header("Authorization", this.client.setting.bottokens.discordextreme)
                .body(discordextremelist)
                .send()
            console.log(res)
        } catch (err) { this.client.logger.info("[ COULD NOT POST TO discordextremelist ]") }

        const botsgg = {
            "guildCount": this.client.guilds.cache.size,
            "shardCount": this.client.shard.ids.length,
            "shardId": this.client.shard.ids[0]
        }

        try {

            const res = await centra("https://discord.bots.gg/api/v1/bots/749020331187896410/stats", "post")
                .header("Authorization", this.client.setting.bottokens.botsgg)
                .body(botsgg)
                .send()
            console.log(res)
        } catch (err) { this.client.logger.info("[ COULD NOT POST TO discord.bots.gg ]") }

    }
}