const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help command for HexifyMusic')
    ,
    run: async (client, interaction, args) => {
        interaction.reply("testing")
    }
}