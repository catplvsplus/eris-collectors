import { Client } from "eris";
import { MessageCollector } from 'eris-collectors';

// @ts-check

/**
 * 
 * @param {Client} client 
 */
export function messageCollector(client) {
    client.on('messageCreate', message => {
        if (message.content !== 'mc') return;

        const collector = new MessageCollector({
            channel: message.channel,
            client,
            time: 20000,
            max: 10
        });

        console.log(`Started MessageCollector!`);

        collector.on('collect', async (collected) => console.log(`Collected Message: ${collected.id}`));
        collector.on('disposed', async (collected) => console.log(`Disposed Message: ${collected.id}`));

        collector.on('end', async (collection, reason) => {
            console.log(`MessageCollector ended: ${reason || 'No reason'}`);

            await client.createMessage(message.channel.id, {
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