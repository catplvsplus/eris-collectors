import { Guild, Member, Message, TextableChannel, Uncached, User } from 'eris';
import { Reaction } from '../../utils/util';
import { BaseCollector, BaseCollectorOptions } from '../base/BaseCollector';

export type ReactionCollectorKey = [userID: string, emoji: string];

export interface ReactionCollectorOptions extends BaseCollectorOptions<Reaction, ReactionCollectorKey> {
    user?: User|Member|Uncached|string;
    message?: Message|Uncached|string;
    channel?: TextableChannel|Uncached|string;
    guild?: Guild|Uncached|string;
    emojiName?: string;
    emojiId?: string;
}

export class ReactionCollector extends BaseCollector<Reaction, ReactionCollectorKey> {
    public userID?: string;
    public messageID?: string;
    public channelID?: string;
    public guildID?: string;
    public emojiName?: string;
    public emojiId?: string;

    constructor(options: ReactionCollectorOptions) {
        super(options);

        this.userID = typeof options.user == 'string' ? options.user : options.user?.id;
        this.messageID = typeof options.message == 'string' ? options.message : options.message?.id;
        this.channelID = typeof options.channel == 'string' ? options.channel : options.channel?.id;
        this.guildID = typeof options.guild == 'string' ? options.guild : options.guild?.id;
        this.emojiName = options.emojiName;
        this.emojiId = options.emojiId;
    }

    public start(): void {
        super.start();
        this._collect();
    }

    private _collect(): void {
        if (this._isEnded()) return;

        this.client.once('messageReactionAdd', async (message, emoji, reactor) => {
            if (this._isEnded()) return;

            const reaction: Reaction = { ...emoji, message, reactor };

            if (this.userID && reactor.id !== this.userID) return this._collect();
            if (this.messageID && message.id !== this.messageID) return this._collect();
            if (this.channelID && message.channel.id !== this.channelID) return this._collect();
            if (this.guildID && message.guildID !== this.guildID) return this._collect();
            if (this.emojiName && reaction.name !== this.emojiName) return this._collect();
            if (this.emojiId && reaction.id !== this.emojiId) return this._collect();
            if (this.filter && !(await Promise.resolve(this.filter(reaction)))) return this._collect();

            this.collected.set([reaction.reactor.id, reaction.reactor.id], reaction);
            this.emit('collect', reaction);

            this._collect();
        });
    }
}

export async function awaitReaction(options: Omit<ReactionCollectorOptions, "timer" | "maxCollection" | "collected">): Promise<Reaction>;
export async function awaitReaction(options: Omit<ReactionCollectorOptions, "timer" | "maxCollection" | "collected">, timer?: number): Promise<Reaction|null> {
    const collector = new ReactionCollector({ ...options, maxCollection: 1, timer });

    collector.start();

    return new Promise((res, rej) => {
        collector.on("collect", reaction => res(reaction));
        collector.on("end", reason => {
            if (reason === "timeout") return res(null);
            if (!collector.collected.size) return;

            rej(new Error(`Collector ended: ${reason || 'Unknown reason'}`));
        });
    });
}