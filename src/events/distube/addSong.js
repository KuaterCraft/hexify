const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GMessage = new Database("./src/database/models/message.json", { databaseInObject: true });
const GSetup = new Database("./src/database/models/setup.json", { databaseInObject: true });

module.exports = async (client, queue, song) => {
    const db = await GSetup.get(queue.textChannel.guild.id);
    if (db.setup_enable === true) return;

    const data = await GMessage.get(queue.textChannel.guild.id);
    const msg = await queue.textChannel.messages.cache.get(data.message_id);

    const embed = new EmbedBuilder()
        .setDescription(`**\`Song\`**\n\n${client.emotes.PLAY} **Name:** ${song.name}\n${client.emotes.PLAY} **Duration:** ${song.formattedDuration}\n${client.emotes.PLAY} **ID:** ${song.id}\n${client.emotes.PLAY} **Source:** ${song.source}\n${client.emotes.PLAY} **URL:** ${song.url}\n${client.emotes.PLAY} **Views:** ${song.views}\n${client.emotes.PLAY} **Requester:** ${song.user}\n`)
        .setColor(client.config.EMBED_COLOR)

    await msg.edit({ content: " ", embeds: [embed] })
}
