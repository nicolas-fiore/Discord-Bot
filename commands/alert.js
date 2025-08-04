const { SlashCommandBuilder } = require('discord.js');
const yahooFinance = require('yahoo-finance2').default; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alert')
        .setDescription('Enter a symbol and get related price and information back')
        .addStringOption(option => 
            option.setName('symbol')
                .setDescription('Search by Symbol')
                .setRequired(true))
            .addNumberOption(option => 
                option.setName('price') 
                    .setDescription('Target Price')
                    .setRequired(true))
                .addNumberOption(option =>
                    option.setName(`direction`)
                        .setDescription('Choose direction: Type "1" to alert when price goes ABOVE target, or "2" for BELOW target.')
                        .setRequired(true)),             
async execute(interaction) {
    const symbol = interaction.options.getString('symbol');
    const targetPrice = interaction.options.getNumber('price');
    const direction = interaction.options.getString(`direction`); //ADDME: THE INTENDED DIRECTION
    
    await interaction.reply(`Target price of $${targetPrice} has been created for ${symbol}`);
    
    const interval = setInterval(async () => {
        try {
            const result = await yahooFinance.quote(symbol);
        
            if (result.regularMarketPrice >= targetPrice){ 
                clearInterval(interval); 
                await interaction.followUp(`Target Price has been hit! ${symbol} is now at $${result.regularMarketPrice.toFixed(2)}: Your target price was $${targetPrice}`);
            } else {
                console.log(`Target price:$${targetPrice} > $${result.regularMarketPrice}`)
            }


        } catch (error) {
            clearInterval(interval); 
            await interaction.followUp(`the error was ${error.message}`);
        }
    }, 60000);
  },
};    
