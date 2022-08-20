import { Message } from 'eris';
import { Reaction } from '../../utils/util';
import { BaseCollector, BaseCollectorOptions } from '../base/BaseCollector';

export interface ReactionCollectorOptions extends BaseCollectorOptions<Reaction> {
    message: Message;
}

export class ReactionCollector extends BaseCollector<Reaction> {
    protected message: Message;

    constructor(options: ReactionCollectorOptions) {
        super(options);

        this.message = options.message;
    }
}