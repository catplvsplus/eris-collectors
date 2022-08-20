import { Client } from 'eris';
import EventEmitter from 'events';
import { Awaitable } from '../../utils/util';
import { Collection } from '../Collection';

export interface BaseCollectorOptions<Collected extends any = any> {
    captureRejections?: boolean;
    collected?: Collection<string, Collected>;
    filter?: (data: Collected) => Awaitable<boolean|void|undefined|null>;
    client: Client;
    timer: number;
}

export class BaseCollector<Collected extends any = any> extends EventEmitter {
    protected client: Client;
    protected timer: number;
    protected collected: Collection<string, Collected>;

    constructor(options: BaseCollectorOptions<Collected>) {
        super(options);

        this.client = options.client;
        this.timer = options.timer;
        this.collected = options.collected ?? new Collection();
    }
}