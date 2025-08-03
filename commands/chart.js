const { SlashCommandBuilder } = require('discord.js');
const yahooFinance = require('yahoo-finance2').default; 
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chart')
        .setDescription('Enter a symbol and get its charted history back')
        .addStringOption(option => 
            option.setName('symbol')
                .setDescription('Search by Symbol')
                .setRequired(true)),
    async execute(interaction) {
        const ticker = interaction.options.getString('symbol');

        async function getStockHistory(symbol) { 
            try{ 
            const quereyOption = { period1: '2021-02-01', interval: '1d'}
            const result = await yahooFinance.chart(symbol, quereyOption); 

            return result;

            } catch (error) { 
                await interaction.reply(`The error was ${error.message}`);
            }
        }
        getStockHistory('AAPL').then(data =>  {
            console.log(data); 
        });


    },
};