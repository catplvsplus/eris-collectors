import { Client } from 'eris';
import EventEmitter from 'events';
import { Awaitable } from '../../utils/util';
import { Collection } from '../Collection';

export type BaseCollectorEndReason = 'timeout'|'collectionLimit'|string;

export interface BaseCollectorOptions<Collected extends any = any> {
    captureRejections?: boolean;
    collected?: Collection<string, Collected>;
    maxCollection?: number;
    filter?: (data: Collected) => Awaitable<boolean|void|undefined|null>;
    client: Client;
    timer: number;
}

export interface BaseCollectorEvents<Collected extends unknown> {
    end: [reason?: BaseCollectorEndReason|null];
    collect: [collected: Collected];
}

export interface BaseCollector<Collected extends unknown = any> extends EventEmitter {
    on<E extends keyof BaseCollectorEvents<Collected>>(event: E, listener: (...args: BaseCollectorEvents<Collected>[E]) => Awaitable<void>): this;
    on<E extends string|symbol>(event: Exclude<E, keyof BaseCollectorEvents<Collected>>, listener: (...args: any) => Awaitable<void>): this;

    once<E extends keyof BaseCollectorEvents<Collected>>(event: E, listener: (...args: BaseCollectorEvents<Collected>[E]) => Awaitable<void>): this;
    once<E extends string|symbol>(event: Exclude<E, keyof BaseCollectorEvents<Collected>>, listener: (...args: any) => Awaitable<void>): this;

    emit<E extends keyof BaseCollectorEvents<Collected>>(event: E, ...args: BaseCollectorEvents<Collected>[E]): boolean;
    emit<E extends string|symbol>(event: Exclude<E, keyof BaseCollectorEvents<Collected>>, ...args: any): boolean;

    off<E extends keyof BaseCollectorEvents<Collected>>(event: E, listener: (...args: BaseCollectorEvents<Collected>[E]) => Awaitable<void>): this;
    off<E extends string|symbol>(event: Exclude<E, keyof BaseCollectorEvents<Collected>>, listener: (...args: any) => Awaitable<void>): this;

    removeAllListeners<E extends keyof BaseCollectorEvents<Collected>>(event?: E): this;
    removeAllListeners(event?: string|symbol): this;
}

export class BaseCollector<Collected extends unknown = any> extends EventEmitter {
    public client: Client;
    public timer: number;
    public ended: boolean = false;
    public maxCollection: number;
    public collected: Collection<string, Collected>;
    public filter?: (data: Collected) => Awaitable<boolean|void|undefined|null>;
    public endReason?: BaseCollectorEndReason|null;
    protected _timer?: NodeJS.Timeout;

    constructor(options: BaseCollectorOptions<Collected>) {
        super(options);

        this.client = options.client;
        this.timer = options.timer;
        this.filter = options.filter;
        this.maxCollection = options.maxCollection ?? 0;
        this.collected = options.collected ?? new Collection();
    }

    public start(): void {
        this._timer = setTimeout(() => this.stop('timeout'), this.timer);
        this.ended = false;
        this.endReason = undefined;
    }

    public stop(reason?: BaseCollectorEndReason|null): void {
        if (!this._timer) return void 0;

        clearTimeout(this.timer);
        this._timer = undefined;
        this.ended = true;
        this.endReason = reason;
        
        this.emit('end', reason);
    }

    public resetTimer(): void {
        if (this._timer) this._timer = setTimeout(() => this.stop('timeout'));
    }

    protected _isEnded(): boolean {
        if (this.ended || this.maxCollection && this.collected.size >= this.maxCollection) {
            if (!this.ended) this.stop('collectionLimit');
            return true;
        }

        return false;
    }
}