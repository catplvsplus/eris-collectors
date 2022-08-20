import { Client } from 'eris';
import EventEmitter from 'events';
import { Awaitable } from '../../utils/util';
import { Collection } from '../Collection';

export type BaseCollectorEndReason = 'timeout'|string;

export interface BaseCollectorOptions<Collected extends any = any> {
    captureRejections?: boolean;
    collected?: Collection<string, Collected>;
    filter?: (data: Collected) => Awaitable<boolean|void|undefined|null>;
    client: Client;
    timer: number;
}

export interface BaseCollectorEvents {
    end: [reason?: BaseCollectorEndReason|null];
}

export interface BaseCollector<Collected extends unknown> extends EventEmitter {
    on<E extends keyof BaseCollectorEvents>(event: E, listener: (...args: BaseCollectorEvents[E]) => Awaitable<void>): this;
    on<E extends string|symbol>(event: Exclude<E, keyof BaseCollectorEvents>, listener: (...args: any) => Awaitable<void>): this;

    once<E extends keyof BaseCollectorEvents>(event: E, listener: (...args: BaseCollectorEvents[E]) => Awaitable<void>): this;
    once<E extends string|symbol>(event: Exclude<E, keyof BaseCollectorEvents>, listener: (...args: any) => Awaitable<void>): this;

    emit<E extends keyof BaseCollectorEvents>(event: E, ...args: BaseCollectorEvents[E]): boolean;
    emit<E extends string|symbol>(event: Exclude<E, keyof BaseCollectorEvents>, ...args: any): boolean;

    off<E extends keyof BaseCollectorEvents>(event: E, listener: (...args: BaseCollectorEvents[E]) => Awaitable<void>): this;
    off<E extends string|symbol>(event: Exclude<E, keyof BaseCollectorEvents>, listener: (...args: any) => Awaitable<void>): this;

    removeAllListeners<E extends keyof BaseCollectorEvents>(event?: E): this;
    removeAllListeners(event?: string|symbol): this;
}

export class BaseCollector<Collected extends unknown> extends EventEmitter {
    public client: Client;
    public timer: number;
    public collected: Collection<string, Collected>;
    public endReason?: BaseCollectorEndReason|null;
    protected _timer?: NodeJS.Timeout;

    constructor(options: BaseCollectorOptions<Collected>) {
        super(options);

        this.client = options.client;
        this.timer = options.timer;
        this.collected = options.collected ?? new Collection();
    }

    public start(): void {
        this._timer = setTimeout(() => this.stop('timeout'));
    }

    public stop(reason?: BaseCollectorEndReason|null): void {
        if (!this._timer) return void 0;

        clearTimeout(this.timer);
        this._timer = undefined;

        this.emit('end', reason);
    }

    public resetTimer(): void {
        if (this._timer) this._timer = setTimeout(() => this.stop('timeout'));
    }
}