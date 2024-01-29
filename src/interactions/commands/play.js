const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database(`./src/database/models/setup.json`, { databaseInObject: true });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Song name/url')
        .addStringOption(option => option.setName('name').setDescription('Enter a song name/url').setRequired(true).setAutocomplete(true)),
    run: async (client, interaction, args) => {
        try {
            if (interaction.options.getString("name")) {
                const db = await GSetup.get(interaction.guild.id);
                // if (db.setup_enable === true) return interaction.reply("Command is disabled already have song request channel!");
                const embed = new EmbedBuilder()
                .setDescription(`${client.emotes.PLAY} **Searching...** \`${interaction.options.getString("name")}\``)
                .setColor(client.config.EMBED_COLOR)
                
                await interaction.reply({ embeds: [embed] });

                const message = await interaction.fetchReply();
                await client.createPlay(interaction, message.id);

                const { channel } = interaction.member.voice;
                if (!channel) return interaction.editReply("You need to be in voice channel.")
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) return interaction.editReply(`I don't have perm \`CONNECT\` in ${channel.name} to join voice!`);
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply(`I don't have perm \`SPEAK\` in ${channel.name} to join voice!`);

                try {
                    const string = interaction.options.getString("name");

                    const options = {
                        member: interaction.member,
                        textChannel: interaction.channel,
                        interaction,
                    }

                    await client.distube.play(interaction.member.voice.channel, string, options);
                } catch (e) {
                    //
                }
            }
        } catch (e) {
            //
        }
    }
}

    