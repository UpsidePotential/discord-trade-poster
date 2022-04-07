import { MessageEmbed, WebhookClient } from 'discord.js';
import WebSocket from 'ws';
import { getSession, ping } from './ibkr-api'


require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const webhookClient = new WebhookClient({ id: process.env.BOT_ID, token: process.env.TOKEN });
let authd = false;
let ws: WebSocket = undefined;


async function main() {
    const session = await getSession();

    if(session) {
        const pingId = setInterval( () => {
            ping().then( (result) => {
                if(!result.RESULT) {
                    const message = `Failed to Ping: ${JSON.stringify(result)}`
                    console.error(message);
                    clearInterval(pingId);
                    throw Error(message);
                }
                    
            });
        }, 1000)
    }

    ws = new WebSocket('wss://localhost:5000/v1/api/ws');

    ws.on('open', function open() {
        console.log('open');
        setInterval( () => {
            ws.send('ech+hb');
            ws.send('tic');
        }, 1000);

    });
      
      ws.on('message', function message(data ,isBinary) {
          const message = JSON.parse(data.toString());
          if(message.topic === 'system') {
              return;
          }
          if(message.topic === 'tic' && message.iserver && !authd) {
              if(message.iserver.authStatus.authenticated) {
                ws.send('spl+{}');
                authd = true;
              } else {
                  throw Error(`failed to auth ${JSON.stringify(message)}`);
              }
          }
          if(message.topic === 'tic') {
              return;
          }


          console.log('message: ', message);
          if(message.topic === 'str')
          {
              //https://interactivebrokers.github.io/cpwebapi/RealtimeSubscription.html
              message.args.forEach((element: any) => {
                const embed = new MessageEmbed()
                .setTitle('New Trade')
                .addField("Symbol", element.ticker)
                .addField("sizeAndFills", element.sizeAndFills)
                .addField("description", element.orderDesc)
                .addField("status", element.status)
                .addField("side", element.side)
                .addField("price", element.price)
                .setColor('#0099ff');

                webhookClient.send({
                    content: 'New Trade',
                    embeds: [embed],
                }); 
              });
          }
      });
}

main().then( () => {
    console.log('done');
}).catch( reason => {
    console.error('exited due to: ', reason);
})
 


