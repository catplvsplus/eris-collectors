import { Client, Constants } from "eris";
import { InteractionCollector } from '../dist/esm.mjs';

// @ts-check

/**
 * 
 * @param {Client} client 
 */
export function interactionCollector(client) {
    client.on('messageCreate', async message => {
        if (message.content !== 'ic') return;

        const reply = await client.createMessage(message.channel.id, {
            messageReference: {
                failIfNotExists: true,
                channelID: message.channelID,
                guildID: message.guildID,
                messageID: message.id
            },
            content: 'Interactions',
            components: [
                {
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: Constants.ComponentTypes.BUTTON,
                            custom_id: 'test1',
                            style: Constants.ButtonStyles.SECONDARY,
                            label: 'Test 1'
                        },
                        {
                            type: Constants.ComponentTypes.BUTTON,
                            custom_id: 'test2',
                            style: Constants.ButtonStyles.SECONDARY,
                            label: 'Test 2'
                        }
                    ]
                }
            ]
        });

        const collector = new InteractionCollector({
            type: Constants.InteractionTypes.MESSAGE_COMPONENT,
            message: reply,
            client,
            time: 20000,
            max: 10
        });

        console.log(`Started InteractionCollector!`);

        collector.on('collect', interaction => {
            if (interaction.type !== Constants.InteractionTypes.MESSAGE_COMPONENT) return;
            console.log(`Collected interaction: ${interaction.id}`);
            interaction.deferUpdate();
        });

        collector.on('userCreate', user => console.log(`user interact: ${user.id}`));

        collector.on('end', async (collection, reason) => {
            console.log('InteractionCollector ended!');

            await reply.edit({
                content: reason || 'No reason',
                components: [],
                embeds: [
                    {
                        description: collection.toJSON().join('\n') || 'None'
                    }
                ]
            });
        });
    });
}