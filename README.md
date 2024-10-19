# Eris Collectors

Create interaction, message, and reaction collectors easily with **eris-collectors**

- [Collector Usage](#collector-usage)
- [Awaiter Usage](#awaiter-usage)

```
npm i eris-collectors
yarn add eris-collectors
pnpm add eris-collectors
```


# Collector Usage

```js
const { MessageCollector } = require('eris-collectors');

const collector = new MessageCollector({
    client: bot,                            // [Required] Your bot client
    channel: channel,                       // [Required] Any text channel
    time: 1000 * 60,                        // [Optional] Collector timeout in milliseconds
    max: 10,                                // [Optional] Max collected messages
    filter: message => !message.author.bot, // [Optional] Custom collector filter
});

collector.on('collect', message => {}); // Emitted when the collector collects a message
collector.on('end', reason => {});      // Emitted when the collector stopped

collector.stop();                       // Stop collecting messages
```

```js
const { ReactionCollector } = require('eris-collectors');

const collector = new ReactionCollector({
    client: bot,                            // [Required] Your bot client
    message: message,                       // [Required] A message to collect reactions from
    time: 1000 * 60,                        // [Optional] Collector timeout in milliseconds
    max: 10,                                // [Optional] Max collected reactions
    maxEmojis: 10,                          // [Optional] Max collected emoji
    maxReactors: 10,                        // [Optional] Max reactors
    filter: reaction => true,               // [Optional] custom collector filter
});

collector.on('collect', reaction => {}); // Emitted when the collector collects a reaction
collector.on('end', reason => {});       // Emitted when the collector stopped

collector.stop();                        // Stop collecting reactions
```

```js
const { InteractionCollector } = require('eris-collectors');
const { Constants } = require('eris');

const collector = new InteractionCollector({
    client: bot,                                                    // [Required] Your bot client
    message: message,                                               // [Optional] A message to collect interactions from
    channel: channel,                                               // [Optional] Collects interactions in a channel
    guild: guild,                                                   // [Optional] Collects interactions from a guild
    interactionType: Constants.InteractionTypes.MESSAGE_COMPONENT,  // [Optional] Sets the interaction type to collect
    maxUsers: maxUsers,                                             // [Optional] Set max users to interact to this collector
    time: 1000 * 60,                                                // [Optional] Collector timeout in milliseconds
    max: 10,                                                        // [Optional] Max collected reactions
    filter: interaction => true,                                    // [Optional] custom collector filter
});

collector.on('collect', interaction => {}); // Emitted when the collector collects an interaction
collector.on('end', reason => {});          // Emitted when the collector stopped

collector.stop();                           // Stop collecting interactions
```

## Awaiter Usage

```js
const { awaitMessage } = require('eris-collectors');

// Single message
const message = await awaitMessage({ client, channel });

// Multiple messages
const messages = await awaitMessage({ client, channel, max: 0 });
```

```js
const { awaitInteraction } = require('eris-collectors');

// Single interaction
const interaction = await awaitInteraction({ client, channel });

// Multiple interactions
const interactions = await awaitInteraction({ client, channel, max: 0 });
```

```js
const { awaitReaction } = require('eris-collectors');

// Single reaction
const reaction = await awaitReaction({ client, channel });

// Multiple reactions
const reactions = await awaitReaction({ client, channel, max: 0 });
```