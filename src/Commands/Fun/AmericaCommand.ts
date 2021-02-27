import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { GetSelf } from "../../lib/Utils"
import centra from "centra"
export default class AmeticaCommand extends Command {
    public constructor() {
        super("america", {
            aliases: ["america", "ame"],
            category: "Fun",
            quoted: true,
            args: [
                {
                    id: "args",
                    type: "array",
                    match: "rest",
                }
            ],
            description: {
                content: "america something or yourself doesnt work on attachment links only real attachments sorry",
                usage: "america",
                example: [
                    "america @user"
                ]
            },
            ratelimit: 3,
            channel: "guild"
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public async exec(message: Message) {
        const msg = await message.channel.send("fetching")
        let url = "";
        if (message.attachments) {
            message.attachments.forEach((attachment) => {
                url = attachment.url;
            });
        }
        if (!url) {
            const user = await GetSelf(message, this.client)
            url = user.user.displayAvatarURL({ format: "png", size: 2048, dynamic: true })
        }

        const res = await centra(`https://api.dagpi.xyz/image/america/?url=${url}`, "get")
            .header("Authorization", this.client.setting.dagpi)
            .send()
        const meme = res.body;

        await message.channel.send("", {
            files: [{ attachment: meme, name: `America.png` }],
        })
        msg.delete

    }
}