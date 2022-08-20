import { Guild, Member, Message, TextableChannel, User } from 'eris';
import { Reaction } from '../../utils/util';
import { BaseCollector, BaseCollectorOptions } from '../base/BaseCollector';

export interface ReactionCollectorOptions extends BaseCollectorOptions<Reaction> {
    user?: User|Member|string;
    message?: Message|string;
    channel?: TextableChannel|string;
    guild?: Guild|string;
    emojiName?: string;
    emojiId?: string;
}

export class ReactionCollector extends BaseCollector<Reaction> {
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

        this.client.on('messageReactionAdd', async (message, emoji, reactor) => {
            if (this._isEnded()) return;

            const reaction: Reaction = { ...emoji, message, reactor };

            if (this.userID && reactor.id !== this.userID) return this._collect();
            if (this.messageID && message.id !== this.messageID) return this._collect();
            if (this.channelID && message.channel.id !== this.channelID) return this._collect();
            if (this.guildID && message.guildID !== this.guildID) return this._collect();
            if (this.emojiName && reaction.name !== this.emojiName) return this._collect();
            if (this.emojiId && reaction.id !== this.emojiId) return this._collect();
            if (this.filter && !(await Promise.resolve(this.filter(reaction)))) return this._collect();

            this.collected.set(reaction.name, reaction);
            this.emit('collect', reaction);

            this._collect();
        });
    }
}