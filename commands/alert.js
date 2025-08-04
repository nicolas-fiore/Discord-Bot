const { SlashCommandBuilder } = require('discord.js');
const yahooFinance = require('yahoo-finance2').default; 
const savedAlerts = []; 

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
        const direction = interaction.options.getNumber(`direction`); 
        const userID = interaction.user.id; 
        const user = await interaction.client.users.fetch(userID); 
        
        
        await interaction.reply(`Target price of $${targetPrice} has been created for ${symbol.toUpperCase()}`);
        
        const interval = setInterval(async () => {
            try {
                const result = await yahooFinance.quote(symbol);
                
                if (direction === 1 && result.regularMarketPrice >= targetPrice){ 
                    clearInterval(interval); 
                    //FIXME: change to user.send when done
                    await interaction.followUp(`Target Price has been hit! ${symbol.toUpperCase()} is now at $${result.regularMarketPrice.toFixed(2)}: Your target price was $${targetPrice}`);

                    const index = savedAlerts.findIndex(alert => alert.interval === interval); 
                    if (index !== -1) { 
                        savedAlerts.splice(index, 1);
                    }
                    return; 

                } else if (direction === 2 && result.regularMarketPrice <= targetPrice) { 
                    clearInterval(interval); 
                    //FIXME: change to user.send when done
                    await interaction.followUp(`Target Price has been hit! ${symbol.toUpperCase()} is now at $${result.regularMarketPrice.toFixed(2)}: Your target price was $${targetPrice}`);
                    
                    const index = savedAlerts.findIndex(alert => alert.interval === interval); 
                    
                    if (index !== -1) { 
                        savedAlerts.splice(index, 1);
                    }
                    return;

                } else {
                    console.log(`Target price:$${targetPrice} > $${result.regularMarketPrice}`)
                }
            } catch (error) {
                clearInterval(interval); 
                await interaction.followUp(`the error was ${error.message}`);
            }
            
        }, 10000);
        
        savedAlerts.push({
            userID, 
            symbol, 
            targetPrice, 
            direction,
            interval
        });
        
    },
};    
//ADDME: Private message User 
//ADDME: Store mutiple alerts