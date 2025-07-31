const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js'); 
const yahooFinance = require('yahoo-finance2').default; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Enter a stock/s ticker and get Price and related information back')
        .addStringOption(option => 
            option.setName('symbol')
                .setDescription('Search by ticker')
                .setRequired(true)),

    async execute(interaction) {
        const ticker = interaction.options.getString('symbol');

        async function getStockPrice(symbol) { 
            try{ 
            const result = await yahooFinance.quote(symbol); 

            if (!result || !result.regularMarketPrice) { 
                await interaction.reply(`No price found for ${symbol}`); 
                return; 
            }
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`Quote for: ${symbol.toUpperCase()}`)
                .addFields(
                    { name: 'Name', value: `${result.shortName}`, inline: true },
                    { name: 'Symbol', value: `${symbol.toUpperCase()}`, inline: true },
                    { name: 'Exchange', value: `${result.fullExchangeName}`, inline: true },
                    { name: 'Price', value: `$${result.regularMarketPrice}`, inline: true },
                    { name: 'High', value: `$${result.regularMarketDayHigh}`, inline: true },
                    { name: 'High', value: `$${result.regularMarketDayLow}`, inline: true }
                )
            await interaction.reply({ embeds : [embed] });

            } catch (error) { 
                await interaction.reply(`The error was ${error.message}`)
            }
        
        }

        getStockPrice(ticker)

    },
};