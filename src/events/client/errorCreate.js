const Discord = require('discord.js');
const generator = require('generate-password');

module.exports = (client, err, command, interaction) => {
    console.log(err);
    const password = generator.generate({
        length: 10,
        numbers: true
    });

    const errorlog = new Discord.WebhookClient({
        id: client.webhooks.errorLogs.id,
        token: client.webhooks.errorLogs.token,
    });

    let embed = new Discord.EmbedBuilder()
        .setTitle(`<:hcross:1199706326188691556>・${password}`)
        .addFields(
            { name: "➡〡Guild", value: `${interaction.guild.name || interaction.guild.id} (${interaction.guild.id})`},
            { name: `➡〡Command`, value: `${command}`},
            { name: `➡〡Error`, value: `\`\`\`${err}\`\`\``},
            { name: `➡ 〡Stack error`, value: `\`\`\`${err.stack.substr(0, 1018)}\`\`\``},
        )
        .setColor(client.config.EMBED_COLOR)
    errorlog.send({
        username: `Bot errors`,
        embeds: [embed],

    }).catch(error => { console.log(error) })

    let row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setLabel("Support server")
                .setURL(client.config.discord.serverInvite)
                .setStyle(Discord.ButtonStyle.Link),
        );

    client.embed({
        title: `${client.emotes.normal.error}・Error`,
        desc: `There was an error executing this command! You can try executing it again.`,
        color: client.config.colors.error,
        fields: [
            {
                name: `Devs has been successfully notified. Until try executing it again.`,
                value: `The developer of this bot <@844535327892701205> | **\`kuatercraft\`** has been notified about this error and will try to fix it asap! Please try executing this command again!.`,
                inline: true,
            }
        ],
        components: [row],
        type: 'editreply'
    }, interaction).catch(() => {
        client.embed({
            title: `${client.emotes.normal.error}・Error`,
            desc: `There was an error executing this command! You can try executing it again.`,
        color: client.config.colors.error,
        fields: [
            {
                name: `Devs has been successfully notified. Until try executing it again.`,
                value: `The developer of this bot <@844535327892701205> | **\`kuatercraft\`** has been notified about this error and will try to fix it asap! Please try executing this command again!.`,
                    inline: true,
                }
            ],
            components: [row],
            type: 'editreply'
        }, interaction)
    })
};