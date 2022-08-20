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
        this.client.on('messageReactionAdd', async (message, emoji, reactor) => {
            if (this.ended || this.maxCollection && this.collected.size >= this.maxCollection) {
                if (!this.ended) this.stop('collectionLimit');
                return;
            }

            const reaction: Reaction = { ...emoji, message, reactor };

            if (this.userID && reactor.id !== this.userID) return;
            if (this.channelID && message.channel.id !== this.channelID) return;
            if (this.guildID && message.guildID !== this.guildID) return;
            if (this.filter && !(await Promise.resolve(this.filter(reaction)))) return;

            this.collected.set(reaction.name, reaction);
            this.emit('collect', reaction);

            this._collect();
        });
    }
}