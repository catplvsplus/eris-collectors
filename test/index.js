// @ts-check
const { CommandInteraction } = require('eris');
const eris = require('eris');
const { MessageCollector, ReactionCollector, InteractionCollector, awaitMessage, awaitReaction, awaitInteraction } = require('../dist');

require('dotenv').config();

const client = new eris.Client(`Bot ${process.env.TOKEN}`);

client.on('ready', () => console.log('ready!'));

client.on('messageCreate', async msg => {
    const message = await client.getMessage(msg.channel.id, msg.id);

    switch (message.content) {
        case 'm':
            const messageCollector = new MessageCollector({
                client,
                timer: 1000 * 60,
                maxCollection: 1,
                user: '854230366088200233'
            });

            messageCollector.on('collect', message => console.log(`Collected ${message.id}`));
            messageCollector.on('end', reason => console.log(reason, messageCollector.collected.size));

            messageCollector.start();
            console.log(messageCollector);
            break;
        case 'r':
            const reply = await message.channel.createMessage({
                content: 'React here!',
                messageReference: {
                    messageID: message.id
                }
            });
            
            const reactionCollector = new ReactionCollector({
                client,
                timer: 1000 * 60,
                maxCollection: 5,
                message: reply,
                user: '749120018771345488'
            });

            reactionCollector.on('collect', reaction => console.log(`Collected ${reaction.id ?? reaction.name}`));
            reactionCollector.on('end', reason => console.log(reason, reactionCollector.collected.size));

            reactionCollector.start();
            console.log(reactionCollector);
            break;
        case 'i':
            const interactionCollector = new InteractionCollector({
                client,
                timer: 1000 * 60 * 2,
                maxCollection: 3,
                commandName: 'test'
            });

            // @ts-ignore
            interactionCollector.on('collect', interaction => { console.log(`Collected ${interaction.id}`); interaction.createMessage('Hi'); });
            interactionCollector.on('end', reason => console.log(reason, interactionCollector.collected.size));

            interactionCollector.start();
            console.log(interactionCollector);
            break;
        case 'am':
            const msg = await awaitMessage({
                client,
                channel: message.channel,
                user: message.author,
                filter: message => message.content === 'noob'
            });

            console.log(msg);
            break;
        case 'ar':
            const _ = await message.channel.createMessage({
                content: 'React here!',
                messageReference: {
                    messageID: message.id
                }
            });

            const reaction = await awaitReaction({
                client,
                message: _,
                user: message.author
            });

            console.log(reaction);
            break;
        case 'ai':
            const interaction = await awaitInteraction({
                client,
                user: message.author,
            });

            // @ts-ignore
            interaction.createMessage('hi');
            break;
    }
});

client.connect();