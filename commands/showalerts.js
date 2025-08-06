const { SlashCommandBuilder } = require('discord.js');
const yahooFinance = require('yahoo-finance2').default; 
const { EmbedBuilder } = require('discord.js'); 
const { savedAlerts } = require('./alert')
 


 module.exports = {
    data: new SlashCommandBuilder()
        .setName('showalerts')
        .setDescription('See all active alerts'), 
    async execute(interaction) {
        
        const userID = interaction.user.id; 
        const userAlerts = savedAlerts.filter(alert => alert.userID === userID); 
        userAlerts.map(alert => `${alert.symbol.toUpperCase()}  $${alert.targetPrice}`).join('\n')
        


//         const embed = new EmbedBuilder()
//             .setColor(0xFF0000)
//             .setTitle(`All saved watchlists`)
//             .addFields(
//                 {name: `${alert.symbol.toUpperCase()}`, value: `$${alert.targetPrice}`, inline: true } 
//             );
    },
 };