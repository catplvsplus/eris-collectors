import { Message, TextableChannel } from 'eris';
import { BaseCollector, BaseCollectorOptions } from '../base/BaseCollector';

export interface MessageCollectorOptions extends BaseCollectorOptions<Message> {
    channel: TextableChannel;
}

export class MessageCollector extends BaseCollector<Message> {
    protected channel: TextableChannel;
    
    constructor(options: MessageCollectorOptions) {
        super(options);

        this.channel = options.channel;
    }
}