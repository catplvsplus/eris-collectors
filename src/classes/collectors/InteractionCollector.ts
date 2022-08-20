import { Interaction } from 'eris';
import { BaseCollector, BaseCollectorOptions } from '../base/BaseCollector';

export interface InteractionCollectorOptions extends BaseCollectorOptions<Interaction> {

}

export class InteractionCollector extends BaseCollector {
    constructor(options: InteractionCollectorOptions) {
        super(options);
    }
}