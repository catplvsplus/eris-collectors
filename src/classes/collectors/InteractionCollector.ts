import { AnyInteraction, AutocompleteInteraction, CommandInteraction, ComponentInteraction, Constants, Guild, Interaction, Member, Message, PingInteraction, TextableChannel, UnknownInteraction, User } from 'eris';
import { BaseCollector, BaseCollectorOptions } from '../base/BaseCollector';

export interface InteractionCollectorOptions extends BaseCollectorOptions<AnyInteraction|UnknownInteraction> {
    user?: User|Member|string;
    message?: Message|string;
    channel?: TextableChannel|string;
    guild?: Guild|string;
    custom_id?: string;
    commandName?: string;
    interactionType?: keyof Constants["InteractionTypes"];
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
        this.interactionType = options.interactionType ? Constants.InteractionTypes[options.interactionType] : undefined;
    }

    public start(): void {
        super.start();
        this._collect();
    }

    private _collect(): void {
        this._isEnded();

        this.client.once('interactionCreate', async interaction => {
            this._isEnded();
            
            if (this.interactionType && interaction.type !== this.interactionType) return;
            if (!this._isPong(interaction)) {
                if (this.guildID && interaction.guildID !== this.guildID) return;
                if (this.channelID && interaction.channel?.id !== this.channelID) return;
                if (this.userID && interaction.user?.id !== this.channelID) return;

                if (this._isMessageComponent(interaction)) {
                    if (this.customID && interaction.data.custom_id !== this.customID) return;
                    
                    const parent = await interaction.getOriginalMessage();
                    if (this.messageID && parent.id !== this.messageID) return;
                }

                if (this._isCommand(interaction) || this._isAutocomplete(interaction)) {
                    if (this.commandName && interaction.data.name !== this.commandName) return;
                }
            }

            this.collected.set(interaction.id, interaction);
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