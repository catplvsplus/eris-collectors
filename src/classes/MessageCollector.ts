import { Collector, CollectorOptions } from './Collector.js';
import { decrementMaxEventListeners, incrementMaxEventListeners } from '../utils/adjustMaxEventListeners.js';
import { AnyChannel, AnyThreadChannel, Constants, Guild, GuildTextableChannel, Message, PossiblyUncachedMessage, TextableChannel, Uncached } from 'eris';

export interface MessageCollectorOptions extends CollectorOptions<Message> {
    channel: TextableChannel;
}

export class MessageCollector extends Collector<Message> {
    readonly channel: TextableChannel;

    constructor(options: MessageCollectorOptions) {
        super(options);

        this.channel = options.channel;

        this._handleMessageDeleteBulk = this._handleMessageDeleteBulk.bind(this);
        this._handleChannelDelete = this._handleChannelDelete.bind(this);
        this._handleThreadDelete = this._handleThreadDelete.bind(this);
        this._handleGuildDelete = this._handleGuildDelete.bind(this);

        incrementMaxEventListeners(this.client);

        this.client.on('messageCreate', this.handleCollect);
        this.client.on('messageDelete', this.handleDispose);
        this.client.on('messageDeleteBulk', this._handleMessageDeleteBulk);
        this.client.on('channelDelete', this._handleChannelDelete);
        this.client.on('threadDelete', this._handleThreadDelete);
        this.client.on('guildDelete', this._handleGuildDelete);

        this.once('end', () => {
            this.client.removeListener('messageCreate', this.handleCollect);
            this.client.removeListener('messageDelete', this.handleDispose);
            this.client.removeListener('messageDeleteBulk', this._handleMessageDeleteBulk);
            this.client.removeListener('channelDelete', this._handleChannelDelete);
            this.client.removeListener('threadDelete', this._handleThreadDelete);
            this.client.removeListener('guildDelete', this._handleGuildDelete);

            decrementMaxEventListeners(this.client);
        });
    }

    protected async _handleMessageDeleteBulk(messages: PossiblyUncachedMessage[]): Promise<void> {
        for (const message of messages) {
            this.handleDispose(message);
        }
    }

    protected async _handleChannelDelete(channel: AnyChannel): Promise<void> {
        if (channel.id === this.channel.id || this.channel.type === Constants.ChannelTypes.GUILD_PUBLIC_THREAD && this.channel.parentID === channel.id) {
            this.stop('channelDelete');
        }
    }

    protected async _handleThreadDelete(thread: AnyThreadChannel): Promise<void> {
        if (thread.id === this.channel.id) this.stop('threadDelete');
    }

    protected async _handleGuildDelete(guild: Uncached|Guild): Promise<void> {
        if (this.channel.type === Constants.ChannelTypes.DM) return;
        if ((this.channel as GuildTextableChannel).guild.id === guild.id) this.stop('guildDelete');
    }

    protected async _collect(message: Message): Promise<[string, Message] | null> {
        return message.channel.id === this.channel.id ? [message.id, message] : null;
    }

    protected async _dispose(message: PossiblyUncachedMessage): Promise<[string, PossiblyUncachedMessage] | null> {
        return message.channel.id === this.channel.id ? [message.id, message] : null;
    }
}