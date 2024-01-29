const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GMessage = new Database("./src/database/models/message.json", { databaseInObject: true });
const GSetup = new Database("./src/database/models/setup.json", { databaseInObject: true });

module.exports = async (client, queue, playlist) => {
    const db = await GSetup.get(queue.textChannel.guild.id);
    if (db.setup_enable === true) return;

    const data = await GMessage.get(queue.textChannel.guild.id);
    const msg = await queue.textChannel.messages.cache.get(data.message_id);

    const embed = new EmbedBuilder()
        .setDescription(`**Queued • [${playlist.name}](${playlist.url})** \`${queue.formattedDuration}\` (${playlist.songs.length} tracks) • ${playlist.user}`)
        .setColor(client.config.EMBED_COLOR)
  
    await msg.edit({ content: " ", embeds: [embed] })
}
