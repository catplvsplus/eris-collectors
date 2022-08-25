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
    filter: message => !message.author.bot, // Optional custom collector filter
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
    filter: reaction => !reaction.reactor.bot, // Optional custom collector filter
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
    filter: interaction => interaction.data.name == 'command', // Optional custom collector filter
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

### Awaiters

```js
const { awaitMessage } = require('eris-collectors');

// In an async function
const message = await awaitMessage({
    client: bot, // Your bot client
    filter: message => !message.author.bot, // Optional custom awaiter filter
    user: '000000000000000000', // Optional, Await message from a specific user
    channel: '000000000000000000', // Optional, Await message from this specific channel
    guild: '000000000000000000', // Optional, Await message from this specific guild
});
```

```js
const { awaitReaction } = require('eris-collectors');

// In an async function
const message = await awaitReaction({
    client: bot, // Your bot client
    filter: reaction => !reaction.reactor.bot, // Optional custom awaiter filter
    user: '000000000000000000', // Optional, Await reaction from a specific user
    message: '000000000000000000', // Optional, Await reaction from a specific message 
    channel: '000000000000000000', // Optional, Await reaction from this specific channel
    guild: '000000000000000000', // Optional, Await reaction from this specific guild
});
```

```js
const { awaitInteraction } = require('eris-collectors');

// In an async function
const message = await awaitInteraction({
    client: bot, // Your bot client
    filter: interaction => interaction.data.name == 'command', // Optional custom awaiter filter
    user: '000000000000000000', // Optional, Await interaction from a specific user
    message: '000000000000000000', // Optional, Await component interaction from a specific message
    channel: '000000000000000000', // Optional, Await interaction from this specific channel
    guild: '000000000000000000', // Optional, Await interaction from this specific guild
    custom_id: '', // Optional, Await interaction with this custom_id
    commandName: '' // Optional, Await interaction with this command name
});
```