import { Collector, CollectorEvents, CollectorOptions } from './Collector.js';
import { decrementMaxEventListeners, incrementMaxEventListeners } from '../utils/adjustMaxEventListeners.js';
import { Collection } from '@discordjs/collection';
import { AnyChannel, AnyThreadChannel, Guild, Member, Message, PartialEmoji, PossiblyUncachedMessage, TextableChannel, Uncached, User } from 'eris';

export interface CollectedMessageReaction {
    id: string;
    emoji: PartialEmoji;
    burst: boolean;
    messageID: string;
    message: PossiblyUncachedMessage;
    channelID?: string;
    channel?: Uncached|TextableChannel;
    guildID?: string|null;
    guild?: Uncached|Guild|null;
}

export interface ReactionCollectorOptions extends CollectorOptions<CollectedMessageReaction> {
    message: Message;
    maxEmojis?: number;
    maxReactors?: number;
}

export interface ReactionCollectorEvents extends CollectorEvents<CollectedMessageReaction> {
    reactorAdd: [reactor: Uncached|User|Member, emoji: PartialEmoji];
    reactorDelete: [reactor: Uncached|User|Member, emoji: PartialEmoji];
}

export class ReactionCollector extends Collector<CollectedMessageReaction, ReactionCollectorEvents> {
    readonly message: Message;
    readonly reactors: Collection<string, { id: string; reactions: string[]; }> = new Collection();

    get maxEmojis() { return this.options.maxEmojis; }
    get maxReactors() { return this.options.maxReactors; }

    get endReason() {
        if (this.maxEmojis && this.collection.size >= this.maxEmojis) return 'emojiLimit';
        if (this.maxReactors && this.reactors.size >= this.maxReactors) return 'reactorlimit';

        return super.endReason;
    }

    constructor(readonly options: ReactionCollectorOptions) {
        super(options);

        this.message = options.message;

        this._handleEmpty = this._handleEmpty.bind(this);
        this._handleMessageDelete = this._handleMessageDelete.bind(this);
        this._handleMessageDeleteBulk = this._handleMessageDeleteBulk.bind(this);
        this._handleChannelDelete = this._handleChannelDelete.bind(this);
        this._handleThreadDelete = this._handleThreadDelete.bind(this);
        this._handleGuildDelete = this._handleGuildDelete.bind(this);

        incrementMaxEventListeners(this.client);

        this.client.on('messageReactionAdd', this.handleCollect);
        this.client.on('messageReactionRemove', this.handleDispose);
        this.client.on('messageReactionRemoveAll', this._handleEmpty);
        this.client.on('messageDelete', this._handleMessageDelete);
        this.client.on('messageDeleteBulk', this._handleMessageDeleteBulk);
        this.client.on('channelDelete', this._handleChannelDelete);
        this.client.on('threadDelete', this._handleThreadDelete);
        this.client.on('guildDelete', this._handleGuildDelete);

        this.once('end', () => {
            this.client.removeListener('messageReactionAdd', this.handleCollect);
            this.client.removeListener('messageReactionRemove', this.handleDispose);
            this.client.removeListener('messageReactionRemoveAll', this._handleEmpty);
            this.client.removeListener('messageDelete', this._handleMessageDelete);
            this.client.removeListener('messageDeleteBulk', this._handleMessageDeleteBulk);
            this.client.removeListener('channelDelete', this._handleChannelDelete);
            this.client.removeListener('threadDelete', this._handleThreadDelete);
            this.client.removeListener('guildDelete', this._handleGuildDelete);
            decrementMaxEventListeners(this.client);
        });
    }

    protected async _handleEmpty(): Promise<void> {
        this.empty();
    }

    protected async _handleMessageDelete(message: PossiblyUncachedMessage): Promise<void> {
        if (message.id === this.message.id) this.stop('messageDelete');
    }

    protected async _handleMessageDeleteBulk(messages: PossiblyUncachedMessage[]): Promise<void> {
        const msg = messages.find(m => m.id === this.message.id);
        if (msg) this._handleMessageDelete(msg);
    }

    protected async _handleChannelDelete(channel: AnyChannel): Promise<void> {
        if (channel.id === this.message.channel.id) this.stop('channelDelete');
    }

    protected async _handleThreadDelete(thread: AnyThreadChannel): Promise<void> {
        if (thread.id === this.message.channel.id) this.stop('threadDelete');
    }

    protected async _handleGuildDelete(guild: Uncached|Guild): Promise<void> {
        if (guild.id === this.message.guildID) this.stop('guildDelete');
    }

    protected async _collect(message: PossiblyUncachedMessage, emoji: PartialEmoji, reactor: Uncached|User|Member, burst: boolean): Promise<[string, CollectedMessageReaction] | null> {
        const emojiID = ReactionCollector.getEmojiID(emoji);
        const reactedUser = this.reactors.find(r => reactor.id === r.id);

        this.reactors.set(reactor.id, {
            id: reactor.id,
            reactions: [...new Set([...(reactedUser?.reactions ?? []), emojiID]).values()]
        });

        this.emit('reactorAdd', reactor, emoji);

        return message.id === this.message.id ? [ReactionCollector.getEmojiID(emoji), this.parseReaction(message, emoji, reactor, burst)] : null;
    }

    protected async _dispose(message: PossiblyUncachedMessage, emoji: PartialEmoji, reactorID: string, burst: boolean): Promise<[string, CollectedMessageReaction] | null> {
        const emojiID = ReactionCollector.getEmojiID(emoji);
        const reactedUser = this.reactors.find(r => reactorID === r.id && r.reactions.includes(emojiID));

        if (reactedUser) {
            reactedUser.reactions = reactedUser.reactions.filter(r => r !== emojiID);

            if (!reactedUser.reactions.length) {
                this.reactors.delete(reactedUser.id);
            } else {
                this.reactors.set(reactedUser.id, reactedUser);
            }

            const member = this.message.guildID ? this.client.guilds.get(this.message.guildID)?.members.get(reactorID) ?? null : null;
            const user = this.client.users.get(reactorID) ?? null;

            this.emit('reactorDelete', member || user || { id: reactorID }, emoji);
        }

        return message.id === this.message.id ? [ReactionCollector.getEmojiID(emoji), this.parseReaction(message, emoji, { id: reactorID }, burst)] : null;
    }

    public empty(): void {
        this.reactors.clear();
        super.empty();
    }

    public parseReaction(message: PossiblyUncachedMessage, emoji: PartialEmoji, reactor: Uncached|User|Member, burst: boolean): CollectedMessageReaction {
        return {
            id: ReactionCollector.getEmojiID(emoji),
            emoji,
            burst,
            messageID: message.id,
            message,
            channelID: message.channel.id,
            channel: message.channel,
            guildID: message.guildID,
            guild: message.guildID ? { id: message.guildID } : null
        };
    }

    public static getEmojiID(emoji: PartialEmoji): string {
        return emoji.id || emoji.name;
    }
}