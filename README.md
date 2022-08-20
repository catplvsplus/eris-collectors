# Eris collectors

Collects message,reactions and interactions in eris

## Installation

```bash
npm i eris-collectors
```

## Usage

```js
const { MessageCollector } = require('eris-collectors');

// Message collector
const collector = new MessageCollector({
    client: bot, // Your bot client
    timer: 1000 * 60, // In milliseconds
    maxCollection: 10, // Optional max collected messages
    filter: message => !message.autor.bot, // Optional custom collector filter
    user: '000000000000000000', // Optional, Collect messages from a specific user
    channel: '000000000000000000', // Optional, Collect messages from this specific channel
    guild: '000000000000000000', // Optional, Collect messages from this specific guild
});

collector.on('collect', message => {}); // Emitted when the collector collects a message
collector.on('end', reason => {}); // Emitted when the collector stopped

collector.start(); // Start collecting messages
collector.stop('Optional reason'); // Stop collecting messages
```

```js
const { ReactionCollector } = require('eris-collectors');

// Reaction collector
const collector = new ReactionCollector({
    client: bot, // Your bot client
    timer: 1000 * 60, // In milliseconds
    maxCollection: 10, // Optional max collected reactions
    filter: message => !message.autor.bot, // Optional custom collector filter
    user: '000000000000000000', // Optional, Collect reactions from a specific user
    message: '000000000000000000', // Optional, Collect reactions from a specific message 
    channel: '000000000000000000', // Optional, Collect reactions from this specific channel
    guild: '000000000000000000', // Optional, Collect reactions from this specific guild
});

collector.on('collect', reaction => {}); // Emitted when the collector collects a reaction
collector.on('end', reason => {}); // Emitted when the collector stopped

collector.start(); // Start collecting reactions
collector.stop('Optional reason'); // Stop collecting reactions
```

```js
const { InteractionCollector } = require('eris-collectors');

// Interaction collector
const collector = new InteractionCollector({
    client: bot, // Your bot client
    timer: 1000 * 60, // In milliseconds
    maxCollection: 10, // Optional max collected interactions
    filter: message => !message.autor.bot, // Optional custom collector filter
    user: '000000000000000000', // Optional, Collect interactions from a specific user
    message: '000000000000000000', // Optional, Collect component interactions from a specific message
    channel: '000000000000000000', // Optional, Collect interactions from this specific channel
    guild: '000000000000000000', // Optional, Collect interactions from this specific guild
    custom_id: '', // Optional, Collect interactions with this custom_id
    commandName: '' // Optional, Collect interactions with this command name
});

collector.on('collect', interaction => {}); // Emitted when the collector collects a interaction
collector.on('end', reason => {}); // Emitted when the collector stopped

collector.start(); // Start collecting interactions
collector.stop('Optional reason'); // Stop collecting interactions
```