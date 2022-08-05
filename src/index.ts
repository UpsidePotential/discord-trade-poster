import { MessageEmbed, WebhookClient } from 'discord.js';
import { getSession, ping, getAccounts, getPositions, Positions, comparePositions, getNewPositions } from './ibkr-api'


require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const webhookClient = new WebhookClient({ id: process.env.BOT_ID, token: process.env.TOKEN });
let existingPositions: Positions[] = [];


async function main() {
    const session = await getSession();

    if(!session) {
        throw Error('failed to get session');
    }

    const accounts = await getAccounts();
    if(accounts.length < 1 ) {
        throw Error('failed to load accounts');
    }

    webhookClient.send('online');

    setInterval( () => {
        ping().then( (result) => {
                
        }).catch( reason => {
            console.log("failed ping: ", reason);
        });
    }, 30000);

    setInterval( async () => {
        try {
            const positions = (await getPositions(accounts[0].accountId)).sort( (a, b) => {
                return a.contractDesc.localeCompare(b.contractDesc);
            });

            if(positions.length == 0) {
                return;
            }

            positions.forEach( value => {
                console.log(`${value.fullName} UPnL: ${value.unrealizedPnl} RPnL: ${value.baseRealizedPnl}`);
            });

            const newPositons =  getNewPositions(positions, existingPositions);
            if(comparePositions(positions, existingPositions)) {
                return;
            }

            newPositons.forEach( v => console.log("New Position: " + v.fullName));
            existingPositions = positions;
            
            let promises: Promise<any>[] = [];
            positions.forEach(position => {
                const embed = new MessageEmbed()
                .setColor('#0099ff')
                .addField("Position", `${position.position.toString()} ${position.fullName}`)
                .addFields(
                    { name: 'Cost', value: position.avgPrice.toString(), inline: true },
                    { name: 'PnL', value: position.unrealizedPnl.toString(), inline: true },
                )
                promises.push(webhookClient.send({
                    embeds: [embed],
                }));
            });

            await Promise.all(promises);
            promises = [];

            newPositons.forEach(position => {
                const embed = new MessageEmbed()
                .setColor('#00ff1e')
                .addField("New Position", `${position.position.toString()} ${position.fullName}`)
                .addFields(
                    { name: 'Cost', value: position.avgPrice.toString(), inline: true },
                )
                promises.push(webhookClient.send({
                    embeds: [embed],
                }));
            });

            await Promise.all(promises);

        } catch(e) {
            console.error('Failed due to: ', e)
        }
    }, 60000);
}

main().then( () => {
    console.log('done');
}).catch( reason => {
    console.error('exited due to: ', reason);
    webhookClient.send(`online due to ${reason}`);
    
});

process.on('SIGTERM', () => {
    webhookClient.send(`offline`);
});


