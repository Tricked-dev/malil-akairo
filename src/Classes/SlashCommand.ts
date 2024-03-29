import { AkairoModule } from "discord-akairo";
import type { AkairoModuleOptions } from "discord-akairo";
import type { CommandInteraction, ApplicationCommandOptionChoice } from "discord.js";

/**
 * Options for an interaction command.
 */
interface ApplicationCommandData {
	name: string;
	description: string;
	options?: ApplicationCommandOption[];
	defaultPermission?: boolean;
}

interface ApplicationCommandOption {
	type: number;
	name: string;
	description: string;
	required?: boolean;
	choices?: ApplicationCommandOptionChoice[];
}

interface CommandOptions extends AkairoModuleOptions {
	name?: string;
	description: string;
	options?: ApplicationCommandOption[];
	ownerOnly?: boolean;
}

/**
 * An interaction command.
 */
export default abstract class Command extends AkairoModule {
	/**
	 * The data for the application command
	 */
	data: ApplicationCommandData;

	/**
	 * Whether this command is restricted to the bot owner
	 */
	ownerOnly: boolean;

	/**
	 * @param id - The command name
	 * @param options - The options for this command
	 */
	constructor(id: string, options: CommandOptions) {
		super(id, options);

		this.ownerOnly = options.ownerOnly ?? false;

		this.data = {
			name: id,
			description: options.description,
			options: options.options,
		};
	}

	/**
	 * Executes the command.
	 * @param interaction - The interaction
	 */
	abstract exec(interaction: CommandInteraction): void | Promise<void>;
}
