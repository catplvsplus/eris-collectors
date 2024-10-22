import { Collector, CollectorEvents, CollectorOptions } from './Collector.js';
import { decrementMaxEventListeners, incrementMaxEventListeners } from '../utils/adjustMaxEventListeners.js';
import { Collection } from '@discordjs/collection';
import { AnyChannel, AnyThreadChannel, Constants, AnyInteraction as ErisAnyInteraction, Guild, InteractionTypes, Message, PingInteraction, PossiblyUncachedMessage, TextableChannel, Uncached, User } from 'eris';

export type AnyInteraction = Exclude<ErisAnyInteraction, PingInteraction>;

export interface InteractionCollectorOptions extends CollectorOptions<AnyInteraction> {
    message?: Message;
    channel?: TextableChannel;
    guild?: Guild|Uncached;
    interactionType?: Exclude<InteractionTypes, 1>;
    maxUsers?: number;
}

export interface InteractionCollectorEvents extends CollectorEvents<AnyInteraction> {
    userCreate: [user: User, interaction: AnyInteraction];
}

export class InteractionCollector extends Collector<AnyInteraction, InteractionCollectorEvents> {
    readonly message: Message|null = null;
    readonly channel: TextableChannel|null = null;
    readonly guild: Guild|Uncached|null = null;

    readonly users: Collection<string, User> = new Collection();

    get interactionType() { return this.options.interactionType; }

    get endReason() {
        if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';

        return super.endReason;
    }

    constructor(readonly options: InteractionCollectorOptions) {
        super(options);

        this.message = options.message ?? null;
        this.channel = options.message?.channel ?? options.channel ?? null;
        this.guild = (options.message?.guildID ? { id: options.message?.guildID } : undefined) ?? options.guild ?? null;

        incrementMaxEventListeners(this.client);

        if (this.message) {
            this._handleMessageDelete = this._handleMessageDelete.bind(this);
            this._handleMessageDeleteBulk = this._handleMessageDeleteBulk.bind(this);

            this.client.on('messageDelete', this._handleMessageDelete);
            this.client.on('messageDeleteBulk', this._handleMessageDeleteBulk);
        }

        if (this.channel) {
            this._handleChannelDelete = this._handleChannelDelete.bind(this);
            this._handleThreadDelete = this._handleThreadDelete.bind(this);

            this.client.on('channelDelete', this._handleChannelDelete);
            this.client.on('threadDelete', this._handleThreadDelete);
        }

        if (this.guild) {
            this._handleGuildDelete = this._handleGuildDelete.bind(this);

            this.client.on('guildDelete', this._handleGuildDelete);
        }

        this.client.on('interactionCreate', this.handleCollect);

        this.once('end', () => {
            this.client.removeListener('messageDelete', this._handleMessageDelete);
            this.client.removeListener('messageDeleteBulk', this._handleMessageDeleteBulk);
            this.client.removeListener('channelDelete', this._handleChannelDelete);
            this.client.removeListener('threadDelete', this._handleThreadDelete);
            this.client.removeListener('guildDelete', this._handleGuildDelete);
            this.client.removeListener('integrationCreate', this.handleCollect);

            decrementMaxEventListeners(this.client);
        });
    }

    protected async _handleMessageDelete(message: PossiblyUncachedMessage): Promise<void> {
        if (this.message?.id === message.id || this.message?.id === (message as Message)?.interaction?.id) {
            this.stop('messageDelete');
        }
    }

    protected async _handleMessageDeleteBulk(messages: PossiblyUncachedMessage[]): Promise<void> {
        const msg = messages.find(m => m.id === this.message?.id);
        if (msg) this._handleMessageDelete(msg);
    }

    protected async _handleChannelDelete(channel: AnyChannel): Promise<void> {
        if (channel.id === this.channel?.id || this.channel?.type === Constants.ChannelTypes.GUILD_PUBLIC_THREAD && this.channel.parentID === channel.id) {
            this.stop('channelDelete');
        }
    }

    protected async _handleThreadDelete(thread: AnyThreadChannel): Promise<void> {
        if (this.channel?.id === thread.id) this.stop('threadDelete');
    }

    protected async _handleGuildDelete(guild: Uncached|Guild): Promise<void> {
        if (this.guild?.id !== guild.id) this.stop('guildDelete');
    }

    protected async _collect(interaction: ErisAnyInteraction): Promise<[string, AnyInteraction] | null> {
        if (interaction.type === Constants.InteractionTypes.PING) return null;
        if (this.interactionType && this.interactionType !== interaction.type) return null;
        if (this.message?.id && interaction.type === Constants.InteractionTypes.MESSAGE_COMPONENT && this.message.id !== interaction.message.id) return null;
        if (this.channel && this.channel.id !== interaction.channel.id) return null;
        if (this.guild && this.guild.id !== interaction.guildID) return null;

        if (interaction.user) this.users.set(interaction.user.id, interaction.user);

        return [interaction.id, interaction];
    }

    protected async _dispose(interaction: ErisAnyInteraction): Promise<[string, AnyInteraction] | null> {
        if (interaction.type === Constants.InteractionTypes.PING) return null;
        if (this.interactionType && this.interactionType !== interaction.type) return null;
        if (this.message?.id && interaction.type === Constants.InteractionTypes.MESSAGE_COMPONENT && this.message.id !== interaction.message.id) return null;
        if (this.channel && this.channel.id !== interaction.channel.id) return null;
        if (this.guild && this.guild.id !== interaction.guildID) return null;

        return [interaction.id, interaction];
    }

    public empty(): void {
        this.users.clear();
        super.empty();
    }
}