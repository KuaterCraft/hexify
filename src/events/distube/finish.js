const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GVoice = new Database("./src/database/models/voice.json", { databaseInObject: true });

module.exports = async (client, queue) => {
    const db = await GVoice.get(queue.textChannel.guild.id);

    if (db.voice_enable === true) {
        await client.UpdateMusic(queue);
        
        const embed = new EmbedBuilder()
            .setDescription(`${client.emotes.MUTED} | **Song has been:** \`Ended\``)
            .setColor(client.config.EMBED_COLOR)

        queue.textChannel.send({ embeds: [embed] })
    } else if (db.voice_enable === false) {
        await client.UpdateMusic(queue);
        await client.distube.voices.leave(queue.textChannel.guild);
    
        const embed = new EmbedBuilder()
            .setDescription(`${client.emotes.MUTED} | **Song has been:** \`Ended\``)
            .setColor(client.config.EMBED_COLOR)
    
        queue.textChannel.send({ embeds: [embed] })
    }
}
