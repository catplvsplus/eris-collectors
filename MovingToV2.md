## Collectors

List of breaking changes to collectors

### Options

- [`collected`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/base/BaseCollector.ts#L9) property is no longer a thing, but if you want to modify the collected data you'll need to do that with [`Collector#collection`](https://github.com/NotGhex/eris-collectors/blob/345a07c743de885142aaea2f31d29ffc01f904ef/src/classes/Collector.ts#L30)
- [`maxCollection`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/base/BaseCollector.ts#L10) is now replaced with [`max`](https://github.com/NotGhex/eris-collectors/blob/345a07c743de885142aaea2f31d29ffc01f904ef/src/classes/Collector.ts#L6) and [`maxProcessed`](https://github.com/NotGhex/eris-collectors/blob/345a07c743de885142aaea2f31d29ffc01f904ef/src/classes/Collector.ts#L7)
- [`timer`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/base/BaseCollector.ts#L13) is renamed to [`time`](https://github.com/NotGhex/eris-collectors/blob/345a07c743de885142aaea2f31d29ffc01f904ef/src/classes/Collector.ts#L9) to match discord.js collectors

### Events

- `end` event now has two parameters. These are
  - `collection` All collected items from the collector
  - `reason` The collector end reason.

## Methods

- `Collector#start()` is removed and collectors will always start collecting when they get initialized

## Interaction Collectors

List of breaking changes to interaction collectors

### Options

- [`user`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/InteractionCollector.ts#L5), [`custom_id`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/InteractionCollector.ts#L9), and [`commandName`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/InteractionCollector.ts#LL10C12-L10C12) was removed as they can already be filtered with [`filter`](https://github.com/NotGhex/eris-collectors/blob/345a07c743de885142aaea2f31d29ffc01f904ef/src/classes/Collector.ts#L8)

## Message Collectors

List of breaking changes to message collectors

### Options

- [`user`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/MessageCollector.ts#L5) and [`guild`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/MessageCollector.ts#L7) was removed as they can already be filtered with [`filter`](https://github.com/NotGhex/eris-collectors/blob/345a07c743de885142aaea2f31d29ffc01f904ef/src/classes/Collector.ts#L8)
- [`channel`](https://github.com/NotGhex/eris-collectors/blob/345a07c743de885142aaea2f31d29ffc01f904ef/src/classes/MessageCollector.ts#L6) is now required to identify where to collect messages from

## Reaction Collectors

List of breaking changes to reaction collectors

### Options

- [`user`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/ReactionCollector.ts#L8), [`channel`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/ReactionCollector.ts#L10), [`guild`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/ReactionCollector.ts#L11), [`emojiName`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/ReactionCollector.ts#L12), and [`emojiId`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/ReactionCollector.ts#L13) was removed as they can already be filtered with [`filter`](https://github.com/NotGhex/eris-collectors/blob/345a07c743de885142aaea2f31d29ffc01f904ef/src/classes/Collector.ts#L8)
- [`message`](https://github.com/NotGhex/eris-collectors/blob/2f899b60f2891d7227fd8b37412858a7a6bdeee7/src/classes/collectors/ReactionCollector.ts#L9) is now required to set what message to collect reactions from

### Collection

- Collection key is now the emoji id or name
- The whole collected reaction object is also changed. [here](https://github.com/NotGhex/eris-collectors/blob/345a07c743de885142aaea2f31d29ffc01f904ef/src/classes/ReactionCollector.ts#LL6C24-L6C24)