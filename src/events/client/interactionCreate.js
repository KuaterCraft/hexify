const Discord = require('discord.js');
const { InteractionType, PermissionsBitField } = require("discord.js");
const ytsr = require("@distube/ytsr");
const { SEARCH_DEFAULT } = require("../../config/config")

module.exports = async (client, interaction) => {
    // Commands
    if (interaction.isCommand || interaction.isContextMenuCommand || interaction.isModalSubmit || interaction.isChatInputCommand) {
        if (!interaction.guild || interaction.user.bot) return;
        const allowed = ["844535327892701205", "779304657767628810", "758602295054434334"]
        if (!allowed.includes(interaction.user.id)) {
            return interaction.reply({ content: "This bot is not available for public yet!", ephemeral: true })
        }
        const cmd = client.commands.get(interaction.commandName);
        if (cmd) {
            cmd.run(client, interaction, interaction.options._hoistedOptions)
                .catch(err => {
                    client.emit("errorCreate", err, interaction.commandName, interaction);
                });
        }

        await client.createExSetup(interaction);
        await client.createExVoice(interaction);

        let subCommandName = "";
        try {
            subCommandName = interaction.options.getSubcommand();
        } catch { };
        let subCommandGroupName = "";
        try {
            subCommandGroupName = interaction.options.getSubcommandGroup();
        } catch { };

        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            const Random = SEARCH_DEFAULT[Math.floor(Math.random() * SEARCH_DEFAULT.length)];
            if(interaction.commandName == "play") {
                let choice = []
                await ytsr(interaction.options.getString("name") || Random, { safeSearch: true, limit: 15 }).then(result => {
                    result.items.forEach(x => { choice.push({ name: x.name, value: x.url }) })
                });
                return await interaction.respond(choice).catch(() => { });
            } else if (interaction.options.getSubcommand() == "playskip") {
                let choice = []
                await ytsr(interaction.options.getString("name") || Random, { safeSearch: true, limit: 15 }).then(result => {
                    result.items.forEach(x => { choice.push({ name: x.name, value: x.url }) })
                });
                return await interaction.respond(choice).catch(() => { });
            } else if (interaction.options.getSubcommand() == "playtop") {
                let choice = []
                await ytsr(interaction.options.getString("name") || Random, { safeSearch: true, limit: 15 }).then(result => {
                    result.items.forEach(x => { choice.push({ name: x.name, value: x.url }) })
                });
                return await interaction.respond(choice).catch(() => { });
            }
        }
    }
}

