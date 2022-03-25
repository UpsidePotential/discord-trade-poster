const { MessageEmbed, WebhookClient } = require('discord.js');
require('dotenv').config();

const webhookClient = new WebhookClient({ id: process.env.BOT_ID, token: process.env.TOKEN });

const embed = new MessageEmbed()
	.setTitle('Some Title')
	.setColor('#0099ff');

webhookClient.send({
	content: 'Webhook test',
	embeds: [embed],
});