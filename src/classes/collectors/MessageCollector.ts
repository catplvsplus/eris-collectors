import { Message, TextableChannel } from 'eris';
import { BaseCollector, BaseCollectorOptions } from '../base/BaseCollector';

export interface MessageCollectorOptions extends BaseCollectorOptions<Message> {
    channel?: TextableChannel;
}

export class MessageCollector extends BaseCollector<Message> {
    public channel?: TextableChannel;
    
    constructor(options: MessageCollectorOptions) {
        super(options);

        this.channel = options.channel;
    }

    public start(): void {
        super.start();
        this.collect();        
    }

    private collect(): void {
        this.client.once('messageCreate', async message => {
            if (this.ended || this.maxCollection && this.collected.size >= this.maxCollection) {
                if (!this.ended) this.stop('collectionLimit');
                return;
            }

            if (this.channel && message.channel.id !== this.channel.id) return;

            const msg = await this.client.getMessage(message.channel.id, message.id);
            if (this.filter && !(await Promise.resolve(this.filter(msg)))) return;
            
            this.collected.set(msg.id, msg);
            this.emit('collect', msg);

            this.collect();
        });
    }
}