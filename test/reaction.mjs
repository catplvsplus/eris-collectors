import { Client } from 'eris';
import { ReactionCollector } from '../dist/esm.mjs';

/**
 * 
 * @param {Client} client 
 */
export function reactionCollector(client) {
    client.on('messageCreate', async message => {
        if (message.content !== 'rc') return;

        const reply = await client.createMessage(message.channel.id, {
            content: 'Reaction collector',
            messageReference: {
                failIfNotExists: true,
                channelID: message.channelID,
                guildID: message.guildID,
                messageID: message.id
            }
        });

        const collector = new ReactionCollector({
            client,
            message: reply,
            max: 10
        });

        console.log(`Started ReactionCollector!`);

        collector.on('collect', async (collected) => console.log(`Collected Reaction: ${collected.id}`));
        collector.on('dispose', async (collected) => console.log(`Disposed Reaction: ${collected.id}`));
        collector.on('reactorAdd', async (reactor) => console.log(`Reactor Add: ${reactor.tag}`));
        collector.on('reactorDelete', async (reactor) => console.log(`Reactor Delete: ${reactor.tag}`));

        collector.on('end', async (collection, reason) => {
            console.log('ReactionCollector ended!');

            await reply.edit({
                content: reason || 'No reason',
                embeds: [
                    {
                        description: collection.toJSON().join('\n')
                    }
                ]
            });
        });
    });
}