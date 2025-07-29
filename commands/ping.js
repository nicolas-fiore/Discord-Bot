const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong and latencty information'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true});
        const pingTime = sent.createdTimestamp - interaction.createdTimestamp; 
        const apiLatency = Math.max(0, Math.round(interaction.client.ws.ping)); 

        await interaction.editReply(`Pong! \nBot Latecny: ${pingTime}ms\nAPI Latency: ${apiLatency}ms`)
    },

};