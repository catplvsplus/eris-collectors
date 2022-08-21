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
        if (this._isEnded()) return;

        this.client.once('messageCreate', async message => {
            if (this._isEnded()) return;

            if (this.userID && message.author.id !== this.userID) return this._collect();
            if (this.channelID && message.channel.id !== this.channelID) return this._collect();
            if (this.guildID && message.guildID !== this.guildID) return this._collect();
            if (this.filter && !(await Promise.resolve(this.filter(message)))) return this._collect();
            
            this.collected.set(message.id, message);
            this.emit('collect', message);

            this._collect();
        });
    }
}

export async function awaitMessage(options: Omit<MessageCollectorOptions, "timer" | "maxCollection">): Promise<Message<PossiblyUncachedTextableChannel>> {
    const collector = new MessageCollector({ ...options, maxCollection: 1, timer: undefined });

    collector.start();

    return new Promise((res, rej) => {
        collector.on("collect", message => res(message));
        collector.on("end", reason => {
            if (!collector.collected.size) return;

            rej(new Error(`Collector ended: ${reason || 'Unknown reason'}`));
        });
    });
}