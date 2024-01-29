const { Database } = require("st.db");

const GSetup = new Database("./src/database/models/setup.json", { databaseInObject: true });

module.exports = async (client, channel) => {
  try {
    if ([2, 13].includes(channel.type) && channel.members.has(client.user.id)) {
      const queue = client.distube.getQueue(channel.guild.id);
      if (queue) {
        client.distube.stop(channel);
        return;
      }
    }
    const db = await GSetup.get(channel.guild.id);
    if (channel.type === 0 && db.setup_ch === channel.id) {
      const queue = client.distube.getQueue(channel.guild.id);
      await client.createAlreadySetup(channel);
      if (queue) {
        client.distube.stop(channel);
        client.distube.voices.leave(channel.guild);
      }
    }
  } catch (error) {
    console.error("Error in code optimization:", error);
  }
};
