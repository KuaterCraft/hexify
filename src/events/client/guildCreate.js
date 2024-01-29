const Discord = require('discord.js');

module.exports = async (client, guild) => {
    const allowedGuild = ["1198867350187950080"];

    const guild2 = client.guilds.cache.get(guild.id);
    if (!allowedGuild.includes(guild2)) {
        return guild2.leave();
    }

    const webhookClient = new Discord.WebhookClient({
        id: "1199710185690779678",
        token: "bIKpbM3dUd8b7zm85ywdYUkt1P4pJlH7mmy94BNHYKm9yxJ9liF7kqjdGcKaNyjV_Z7t",
    });

    if (guild == undefined) return;

    try {
        const promises = [
            client.shard.broadcastEval(client => client.guilds.cache.size),
            client.shard.broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        ];
        Promise.all(promises)
            .then(async (results) => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const embed = new Discord.EmbedBuilder()
                    .setTitle("🟢・Added to a new server!")
                    .addFields(
                        { name: "Total servers:", value: `${totalGuilds}`, inline: true },
                        { name: "Server name", value: `${guild.name}`, inline: true },
                        { name: "Server ID", value: `${guild.id}`, inline: true },
                        { name: "Server members", value: `${guild.memberCount}`, inline: true },
                        { name: "Server owner", value: `<@!${guild.ownerId}> (${guild.ownerId})`, inline: true },
                    )
                    .setThumbnail("https://cdn.discordapp.com/attachments/843487478881976381/852419422392156210/BotPartyEmote.png")
                    .setColor(client.config.EMBED_COLOR)
                webhookClient.send({
                    username: 'Bot Logs',
                    avatarURL: client.user.avatarURL(),
                    embeds: [embed],
                });
            })

        let defaultChannel = "";
        guild.channels.cache.forEach((channel) => {
            if (channel.type == Discord.ChannelType.GuildText && defaultChannel == "") {
                if (channel.permissionsFor(guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
                    defaultChannel = channel;
                }
            }
        })

        let row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Invite")
                    .setURL(client.config.discord.botInvite)
                    .setStyle(Discord.ButtonStyle.Link),

                new Discord.ButtonBuilder()
                    .setLabel("Support server")
                    .setURL(client.config.discord.serverInvite)
                    .setStyle(Discord.ButtonStyle.Link),
            );
    }
    catch (err) {
        console.log(err);
    }


};