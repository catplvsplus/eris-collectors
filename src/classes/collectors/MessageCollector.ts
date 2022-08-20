import { Guild, Member, Message, TextableChannel, User } from 'eris';
import { BaseCollector, BaseCollectorOptions } from '../base/BaseCollector';

export interface MessageCollectorOptions extends BaseCollectorOptions<Message> {
    user?: User|Member|string;
    channel?: TextableChannel|string;
    guild?: Guild|string;
}

export class MessageCollector extends BaseCollector<Message> {
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
            
            if (this.userID && message.member?.id !== this.userID) return;
            if (this.channelID && message.channel.id !== this.channelID) return;
            if (this.guildID && message.guildID !== this.guildID) return;

            const msg = await this.client.getMessage(message.channel.id, message.id);
            if (this.filter && !(await Promise.resolve(this.filter(msg)))) return;
            
            this.collected.set(msg.id, msg);
            this.emit('collect', msg);

            this._collect();
        });
    }
}