import { join } from "path";
import { InterfaceClient, req, fourth, sec, sleep } from "../lib/Utils";
import type { User, TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import rateLimit from "fastify-rate-limit";
const fastify = require("fastify")({
	logger: false,
	root: join(__dirname, "..", "..", "..", "public", "html"),
});
export default class Server {
	online: boolean;
	port: number;
	topAuth: string;
	dbotsAuth: string;
	client: InterfaceClient;
	time: number;
	totalGuilds: number;
	totalMembers: number;
	totalChannels: number;
	constructor(client: InterfaceClient, { online = true, port = 3000, topAuth = "6969", dbotsAuth = "6969" }: { online?: boolean; port?: number; topAuth?: string; dbotsAuth?: string }) {
		this.port = port;
		this.client = client;
		this.online = online;
		this.topAuth = topAuth;
		this.dbotsAuth = dbotsAuth;
		this.time = 0;
		this.totalGuilds = 50;
		this.totalMembers = 40000;
		this.totalChannels = 8000;
	}
	public async Start(): Promise<void> {
		if (this.online !== true) return;
		await fastify.register(rateLimit, { global: true, max: 100, timeWindow: 100000 });
		await fastify.register(import("fastify-static"), { root: join(__dirname, "..", "..", "public") });
		// Register all the routes
		await this.Routes();
		await fastify.listen(this.port, "0.0.0.0", () => {
			this.client.logger.info(sec(`Server running at http://localhost:${this.port}`));
		});
		return await sleep("2000").then(() => this.client.logger.info(sec(`Server running at http://localhost:${this.port}`)));
	}
	public async Close(): Promise<void> {
		this.client.logger.warn("[ CLOSING SERVER ]", 5);
		return await fastify.close();
	}
	public async Routes(): Promise<void> {
		/** Votes api */
		await fastify.post("/api/votes", async (req) => {
			return await this.Votes(req);
		});
		await fastify.get("/api/stats", async () => {
			return await this.Stats();
		});
		/** Websites */
		await fastify.register(import("../lib/routes"), { logLevel: "warn" });
		/** 404's */
		return await fastify.setNotFoundHandler({ onRequest: fastify.rateLimit }, (req, res) => {
			const bufferIndexHtml = readFileSync(join(__dirname, "..", "..", "public", "html", "404.html"));
			res.code(404).type("text/html").send(bufferIndexHtml);
		});
	}

	public async Stats(): Promise<{ guilds: number; users: number; channels: number }> {
		if (this.time == 0 || Date.now() - this.time > 1800000) {
			this.time = Date.now();
			this.totalGuilds = await this.client.shard.fetchClientValues("guilds.cache.size").then((serv) => serv.reduce((acc, guildCount) => acc + guildCount, 0));
			// prettier-ignore
			this.totalMembers = await this.client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)').then(member => member.reduce((acc, memberCount) => acc + memberCount, 0))
			// prettier-ignore
			this.totalChannels = await this.client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0)').then(channel => channel.reduce((acc, channelCount) => acc + channelCount, 0))
		}
		return { guilds: this.totalGuilds, users: this.totalMembers, channels: this.totalChannels };
	}
	public async Votes(req: req): Promise<{ success: boolean; status: number; message?: string }> {
		if (req?.headers?.authorization == this.topAuth || req?.headers?.authorization == this.dbotsAuth) {
			let member: User;
			if (req?.headers.authorization == this.topAuth) {
				member = await this.client.users.fetch(req.body.user);
			} else if (req?.headers.authorization == this.dbotsAuth) {
				member = await this.client.users.fetch(req.body.id);
			}
			const iq = Math.floor(Math.random() * 150) + 1;
			this.client.UserData.ensure(member.id, { iq: iq });
			if (!member) return;
			this.client.logger.info(fourth("[ VOTE ] ") + sec(`${member.tag} (${member.id})`));
			const cur = Number(this.client.UserData.get(member.id as string, "iq"));
			if (!cur) return;
			const amount = req.body.isWeekend ? 2 : 1;
			this.client.UserData.set(member.id, cur + amount, "iq");

			const channel = (this.client.channels.cache.get("823935750168117312") || (await this.client.channels.fetch("823935750168117312"))) as TextChannel;
			channel.send(
				new MessageEmbed()
					.setAuthor(`vote from ${member.tag}`, member.avatarURL())
					.setDescription(`**${member} had ${cur || "Nothing"} iq now has ${cur + amount || "Nothing"} iq**`)
					.setTimestamp()
					.setColor("#f000ff")
			);
			return { success: true, status: 200 };
		} else return { success: false, status: 203, message: "Authorization is required to access this endpoint." };
	}
}