export class Collection<K,V> extends Map<K,V> {
    constructor(...entries: [K, V][]) {
        super(entries);
    }
}