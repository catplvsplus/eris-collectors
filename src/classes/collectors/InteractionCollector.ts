import { AnyInteraction, AutocompleteInteraction, CommandInteraction, ComponentInteraction, Constants, Guild, Interaction, Member, Message, PingInteraction, TextableChannel, Uncached, UnknownInteraction, User } from 'eris';
import { BaseCollector, BaseCollectorOptions } from '../base/BaseCollector';

export interface InteractionCollectorOptions extends BaseCollectorOptions<AnyInteraction|UnknownInteraction> {
    user?: User|Member|Uncached|string;
    message?: Message|Uncached|string;
    channel?: TextableChannel|Uncached|string;
    guild?: Guild|Uncached|string;
    custom_id?: string;
    commandName?: string;
    interactionType?: keyof Constants["InteractionTypes"]|number;
}

export class InteractionCollector extends BaseCollector<AnyInteraction|UnknownInteraction> {
    public userID?: string;
    public messageID?: string;
    public channelID?: string;
    public guildID?: string;
    public customID?: string;
    public commandName?: string;
    public interactionType?: number;

    constructor(options: InteractionCollectorOptions) {
        super(options);
        
        this.userID = typeof options.user == 'string' ? options.user : options.user?.id;
        this.messageID = typeof options.message == 'string' ? options.message : options.message?.id;
        this.channelID = typeof options.channel == 'string' ? options.channel : options.channel?.id;
        this.guildID = typeof options.guild == 'string' ? options.guild : options.guild?.id;
        this.customID = options.custom_id;
        this.commandName = options.commandName;
        this.interactionType = typeof options.interactionType == 'string' ? Constants.InteractionTypes[options.interactionType] : options.interactionType;
    }

    public start(): void {
        super.start();
        this._collect();
    }

    private _collect(): void {
        if (this._isEnded()) return;

        this.client.once('interactionCreate', async interaction => {
            if (this._isEnded()) return;

            if (this.interactionType && interaction.type !== this.interactionType) return this._collect();
            if (!this._isPong(interaction)) {
                if (this.guildID && interaction.guildID && interaction.guildID !== this.guildID) return this._collect();
                if (this.channelID && interaction.channel?.id !== this.channelID) return this._collect();
                if (this.userID && interaction.user?.id !== this.channelID) return this._collect();

                if (this._isMessageComponent(interaction)) {
                    if (this.customID && interaction.data.custom_id !== this.customID) return this._collect();
                    
                    const parent = await interaction.getOriginalMessage();
                    if (this.messageID && parent.id !== this.messageID) return this._collect();
                }

                if (this._isCommand(interaction) || this._isAutocomplete(interaction)) {
                    if (this.commandName && interaction.data.name !== this.commandName) return this._collect();
                }
            }
            
            if (this.filter && !(await Promise.resolve(this.filter(interaction)))) return this._collect();

            this.collected.set(interaction.id, interaction);
            this.emit('collect', interaction);
            this._collect();
        });
    }

    private _isPong(interaction: AnyInteraction|UnknownInteraction): interaction is PingInteraction {
        return interaction.type === Constants.InteractionTypes.PING;
    }

    private _isMessageComponent(interaction: AnyInteraction|UnknownInteraction): interaction is ComponentInteraction {
        return interaction.type === Constants.InteractionTypes.MESSAGE_COMPONENT;
    }

    private _isCommand(interaction: AnyInteraction|UnknownInteraction): interaction is CommandInteraction {
        return interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND
    }

    private _isAutocomplete(interaction: AnyInteraction|UnknownInteraction): interaction is AutocompleteInteraction {
        return interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
    }
}

export async function awaitInteraction(options: Omit<InteractionCollectorOptions, "timer" | "maxCollection" | "collected">): Promise<AnyInteraction|UnknownInteraction>;
export async function awaitInteraction(options: Omit<InteractionCollectorOptions, "timer" | "maxCollection" | "collected">, timer?: number): Promise<AnyInteraction|UnknownInteraction|null> {
    const collector = new InteractionCollector({ ...options, maxCollection: 1, timer });

    collector.start();

    return new Promise((res, rej) => {
        collector.on("collect", interaction => res(interaction));
        collector.on("end", reason => {
            if (reason === 'timeout') return rej(reason);
            if (!collector.collected.size) return;

            rej(new Error(`Collector ended: ${reason || 'Unknown reason'}`));
        });
    });
}