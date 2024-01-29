const { EmbedBuilder } = require("discord.js");

module.exports = async (client, queue) => {
    await client.UpdateMusic(queue);

    const embed = new EmbedBuilder()
        .setColor(client.config.EMBED_COLOR)
        .setDescription(`**Channel is Empty!**`)

    queue.textChannel.send({ embeds: [embed] })
}
