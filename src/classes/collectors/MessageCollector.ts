import { Guild, Member, Message, PossiblyUncachedTextableChannel, TextableChannel, User } from 'eris';
import { BaseCollector, BaseCollectorOptions } from '../base/BaseCollector';

export interface MessageCollectorOptions extends BaseCollectorOptions<Message<PossiblyUncachedTextableChannel>> {
    user?: User|Member|string;
    channel?: TextableChannel|string;
    guild?: Guild|string;
}

export class MessageCollector extends BaseCollector<Message<PossiblyUncachedTextableChannel>> {
    public userID?: string;
    public channelID?: string;
    public guildID?: string;
    
    constructor(options: MessageCollectorOptions) {
        super(options);

        this.userID = typeof options.user == 'string' ? options.user : options.user?.id;
        this.channelID = typeof options.channel == 'string' ? options.channel : options.channel?.id;
        this.guildID = typeof options.guild == 'string' ? options.guild : options.guild?.id;
    }

    public start(): void {
        super.start();
        this._collect();        
    }

    private _collect(): void {
        this._isEnded();

        this.client.once('messageCreate', async message => {
            this._isEnded();

            if (!this.userID || this.userID && message.author.id !== this.userID) return;
            if (!this.channelID || this.channelID && message.channel.id !== this.channelID) return;
            if (!this.guildID || this.guildID && message.guildID !== this.guildID) return;
            if (!this.filter || this.filter && !(await Promise.resolve(this.filter(message)))) return;
            
            this.collected.set(message.id, message);
            this.emit('collect', message);

            this._collect();
        });
    }
}