const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js'); 

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('ban') 
    .setDescription('ban a person')
    .addUserOption(option => 
        option.setName('user') 
            .setDescription('The user to ban') 
            .setRequired(true))
        .addStringOption(option => 
            option.setName('reason') 
                .setDescription('Reason for banning')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No Reason Provided'; 

    const targetMember = await interaction.guild.members.fetch(target.id).catch(() => null); 

    if (!targetMember) { 
        return interaction.reply({ content: 'That user is not in the server!', ephemeral: true});
    }

    if (!targetMember.bannable) { 
        return interaction.reply({ content: 'I cannont ban this user brah', ephemeral: true}); 
    }

    try {
        await targetMember.ban(reason); 
        await interaction.reply(`Succesfully ban **${target.tag}** from the server. \nReason: ${reason}`); 
    } catch (error) { 
        console.error(error); 
        await interaction.reply({ content: 'There was an error trying to ban!', ephemeral: true})
    }
  }, 
};