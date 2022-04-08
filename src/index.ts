import { MessageEmbed, WebhookClient } from 'discord.js';
import { getSession, ping, getAccounts, getPositions } from './ibkr-api'


require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const webhookClient = new WebhookClient({ id: process.env.BOT_ID, token: process.env.TOKEN });

async function main() {
    const session = await getSession();

    if(!session) {
        throw Error('failed to get session');
    }

    const accounts = await getAccounts();
    if(accounts.length < 1 ) {
        throw Error('failed to load accounts');
    }

    const pingId = setInterval( () => {
        ping().then( (result) => {
            if(!result.RESULT) {
                const message = `Failed to Ping: ${JSON.stringify(result)}`
                console.error(message);
                clearInterval(pingId);
                throw Error(message);
            }
                
        });
    }, 1000);

    const positions = await getPositions(accounts[0].accountId);
    positions.sort( (a, b) => {
        return a.ticker.localeCompare(b.ticker);
    }).forEach(position => {
        const embed = new MessageEmbed()
        .setTitle('New Trades')
        .addField("Symbol", position.fullName)
        .addField("Count", position.position.toString())
        .addField("Unrealized PnL", position.unrealizedPnl.toString())
        .setColor('#0099ff');

        webhookClient.send({
            content: 'New Trade',
            embeds: [embed],
        }); 
    });
}

main().then( () => {
    console.log('done');
}).catch( reason => {
    console.error('exited due to: ', reason);
})
 


