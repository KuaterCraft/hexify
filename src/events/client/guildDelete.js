const discord = require('discord.js');
const fs = require('fs');

module.exports = async (client, guild) => {
    const kickLogs = new discord.WebhookClient({
        id: "1199710185690779678",
        token: "bIKpbM3dUd8b7zm85ywdYUkt1P4pJlH7mmy94BNHYKm9yxJ9liF7kqjdGcKaNyjV_Z7t",
    });

    if (guild.name == undefined) return;

    const promises = [
        client.shard.broadcastEval(client => client.guilds.cache.size),
        client.shard.broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
    ];
    Promise.all(promises)
        .then(async (results) => {
            const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);

            const embed = new discord.EmbedBuilder()
                .setTitle("🔴・Removed from a server!")
                .addFields(
                    { name: "Total servers:", value: `${totalGuilds}`, inline: true },
                    { name: "Server name", value: `${guild.name}`, inline: true },
                    { name: "Server ID", value: `${guild.id}`, inline: true },
                    { name: "Server members", value: `${guild.memberCount}`, inline: true },
                    { name: "Server owner", value: `<@!${guild.ownerId}> (${guild.ownerId})`, inline: true },
                )
                .setThumbnail("https://cdn.discordapp.com/attachments/843487478881976381/852419424895631370/BotSadEmote.png")
                .setColor(client.config.EMBED_COLOR)
            kickLogs.send({
                username: 'Bot Logs',
                avatarURL: client.user.avatarURL(),
                embeds: [embed],
            });
        })
};