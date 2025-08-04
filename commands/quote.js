const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js'); 
const yahooFinance = require('yahoo-finance2').default; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Enter a symbol and get related price and information back')
        .addStringOption(option => 
            option.setName('symbol')
                .setDescription('Search by Symbol')
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
                    .setTitle(`Quote for: ${symbol}`)
                    .addFields(
                        { name: 'Symbol', value: `${symbol}`, inline: true },
                        { name: 'Exchange', value: `${result.fullExchangeName}`, inline: true },
                        { name: 'Name', value: `${result.shortName}`, inline: true },
                        { name: 'Price', value: `$${result.regularMarketPrice}`, inline: true },
                        { name: 'High', value: `$${result.regularMarketDayHigh}`, inline: true },
                        { name: 'Low', value: `$${result.regularMarketDayLow}`, inline: true },
                        { name: 'Change', value: `${result.regularMarketChangePercent.toFixed(2)}%`, inline: true}, 
                        { name: '52-day High', value: `$${result.fiftyTwoWeekHigh}`, inline: true }, 
                        { name: '52-day low', value: `$${result.fiftyTwoWeekLow}`, inline: true }

                    )
                await interaction.reply({ embeds : [embed] });

            } catch (error) { 
                await interaction.reply(`The error was ${error.message}`)
            }
        
        }

        getStockPrice(ticker.toUpperCase()); 

    },
};