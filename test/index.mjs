import { Client } from 'eris';
import { messageCollector } from './message.mjs';
import { reactionCollector } from './reaction.mjs';
import { interactionCollector } from './interaction.mjs';
import 'dotenv/config';

const client = new Client(`Bot ${process.env.TOKEN}`, {
    intents: ['all']
});

messageCollector(client);
reactionCollector(client);
interactionCollector(client);

await client.connect();