const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./src/database/models/setup.json", { databaseInObject: true });

module.exports = async (client, queue, track) => {
  let intervalId;
  await client.UpdateQueueMsg(queue);
  await client.addChart(track.id);

  const db = await GSetup.get(queue.textChannel.guild.id);
  if (db.setup_enable === true) return;

  var newQueue = client.distube.getQueue(queue.id)

  const channelPlay = await queue.textChannel;

  var data = disspace(newQueue, track, client, channelPlay, intervalId)


  const filter = (message) => {
    if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId === message.member.voice.channelId) return true;
    else {
      message.reply({ content: "You need to be in a same/voice channel.", ephemeral: true });
    }
  };
  
  const collector = nowplay.createMessageComponentCollector({ filter, time: 120000 });

  collector.on('collect', async (message) => {
    const id = message.customId;
    const queue = client.distube.getQueue(message.guild.id);
    if (id === "pause") {
      if (!queue) {
        collector.stop();
      }
      if (queue.paused) {
        await client.distube.resume(message.guild.id);
        const embed = new EmbedBuilder()
          .setColor(client.config.EMBED_COLOR)
          .setDescription(`${client.emotes.PLAY} • **Song has been:** **\`Resumed\`**`);

        message.reply({ embeds: [embed], ephemeral: true });
      } else {
        await client.distube.pause(message.guild.id);
        const embed = new EmbedBuilder()
          .setColor(client.config.EMBED_COLOR)
          .setDescription(`${client.emotes.PAUSE} • **Song has been:** **\`Paused\`**`);

        message.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (id === "skip") {
      if (!queue) {
        collector.stop();
      }
      if (queue.songs.length === 1 && queue.autoplay === false) {
        const embed = new EmbedBuilder()
          .setColor(client.config.EMBED_COLOR)
          .setDescription(`${client.emotes.CROSS} • **There are no** **\`Songs\`** **in queue**`)

        message.reply({ embeds: [embed], ephemeral: true });
      } else {
        await client.distube.skip(message)
        const embed = new EmbedBuilder()
          .setColor(client.config.EMBED_COLOR)
          .setDescription(`${client.emotes.TICK} • **Song has been:** \`Skipped\``)

        nowplay.edit({ components: [] });
        message.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (id === "stop") {
      if (!queue) {
        collector.stop();
      }
      await client.distube.voices.leave(message.guild);
      const embed = new EmbedBuilder()
        .setDescription(`${client.emotes.CROSS} • **Song has been:** • \`Stopped\``)
        .setColor(client.config.EMBED_COLOR);

      await nowplay.edit({ components: [] });
      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "loop") {
      if (!queue) {
        collector.stop();
      }
      if (queue.repeatMode === 0) {
        client.distube.setRepeatMode(message.guild.id, 1);
        const embed = new EmbedBuilder()
          .setColor(client.config.EMBED_COLOR)
          .setDescription(`${client.emotes.REFRESH} • **Song is loop:** **\`Current\`**`)

        message.reply({ embeds: [embed], ephemeral: true });
      } else {
        client.distube.setRepeatMode(message.guild.id, 0);
        const embed = new EmbedBuilder()
          .setColor(client.config.EMBED_COLOR)
          .setDescription(`${client.emotes.REFRESH} • **Song is unloop:** **\`Current\`**`)

        message.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (id === "previous") {
      if (!queue) {
        collector.stop();
      }
      if (queue.previousSongs.length == 0) {
        const embed = new EmbedBuilder()
          .setColor(client.config.EMBED_COLOR)
          .setDescription(`${client.emotes.CROSS} • **There are no** \`Previous\` **songs**`)

        message.reply({ embeds: [embed], ephemeral: true });
      } else {
        await client.distube.previous(message)
        const embed = new EmbedBuilder()
          .setColor(client.config.EMBED_COLOR)
          .setDescription(`${client.emotes.TICK} • **Song has been:** \`Previous\``)

        await nowplay.edit({ components: [] });
        message.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (id === "shuffle") {
      if (!queue) {
        collector.stop();
      }
      await client.distube.shuffle(message);
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${client.emotes.REFRESH} • **Song has been:** **\`Shuffle\`**`);

      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "voldown") {
      if (!queue) {
        collector.stop();
      }
      await client.distube.setVolume(message, queue.volume - 5);
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${client.emotes.SPEAKER} • **Decrease volume to:** **\`${queue.volume}\`%`)

      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "clear") {
      if (!queue) {
        collector.stop();
      }
      await queue.songs.splice(1, queue.songs.length);
      await client.UpdateQueueMsg(queue);

      const embed = new EmbedBuilder()
        .setDescription(`${client.emotes.TICK} • **Queue has been:** **\`Cleared\`**`)
        .setColor(client.color);

      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "volup") {
      if (!queue) {
        collector.stop();
      }
      await client.distube.setVolume(message, queue.volume + 5);
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${client.emotes.SPEAKER} • **Increase volume to:** **\`${queue.volume}\`%`)

      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "queue") {
      if (!queue) {
        collector.stop();
      }
      const pagesNum = Math.ceil(queue.songs.length / 10);
      if (pagesNum === 0) pagesNum = 1;

      const songStrings = [];
      for (let i = 1; i < queue.songs.length; i++) {
        const song = queue.songs[i];
        songStrings.push(
          `**${i}.** [${song.name}](${song.url}) \`[${song.formattedDuration}]\` • ${song.user}
          `);
      };

      const pages = [];
      for (let i = 0; i < pagesNum; i++) {
        const str = songStrings.slice(i * 10, i * 10 + 10).join('');
        const embed = new EmbedBuilder()
          .setAuthor({ name: `Queue - ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
          .setThumbnail(queue.songs[0].thumbnail)
          .setColor(client.color)
          .setDescription(`**Currently Playing:**\n**[${queue.songs[0].name}](${queue.songs[0].url})** **\`[${queue.songs[0].formattedDuration}]\` • ${queue.songs[0].user}\n\n**Rest of queue**${str == '' ? '  Nothing' : '\n' + str}`)
          .setFooter({ text: `Page • ${i + 1}/${pagesNum} • ${queue.songs.length} • Songs • ${queue.formattedDuration} • Total duration` });

        pages.push(embed);
      };

      message.reply({ embeds: [pages[0]], ephemeral: true });
    }


  });
  collector.on('end', async (collected, reason) => {
    clearInterval(intervalId);
    if (reason === "time") {
      nowplay.edit({ components: [] });
    }
  });
}

async function disspace(nowQueue, nowTrack, client, channelPlay, intervalId) {
  const embedFields = [
    { name: `Uploader:`, value: `**[${nowTrack.uploader.name}](${nowTrack.uploader.url})**`, inline: false },
    { name: `Requester:`, value: `${nowTrack.user}`, inline: false },
    { name: `Current Volume:`, value: `${nowQueue.volume}%`, inline: false },
    { name: `Filters:`, value: `${nowQueue.filters.names.join(", ") || "Normal"}`, inline: false },
    { name: `Autoplay:`, value: `${nowQueue.autoplay ? "Activated" : "Not Active"}`, inline: false },
    { name: `Total Duration:`, value: `${nowQueue.formattedDuration}`, inline: false },
    { name: `Current Duration: \`[0:00 / ${nowTrack.formattedDuration}]\``, value: `\`\`\`🔴 • 🎶──────────────────────────────\`\`\``, inline: false },
  ]
  const embed = new EmbedBuilder()
    .setAuthor({ name: `Playing...`, iconURL: 'https://cdn.discordapp.com/emojis/1201057694187008000.png' })
    .setImage(nowTrack.thumbnail)
    .setColor(client.config.EMBED_COLOR)
    .setDescription(`**[${nowTrack.name}](${nowTrack.url})**`)
    .addFields(embedFields)
    .setFooter({ text: client.config.EMBED_FOOTER })
    .setTimestamp();
  
  const row = client.enSwitch;
  const row2 = client.enSwitch2;

  const nowplay = await channelPlay.send({
    embeds: [embed],
    components: [row, row2]
  })

  const updateCurrentDuration = () => {
    const currentTime = Math.floor(nowQueue.currentTime / 1000);

    const currentDurationField = embedFields.find(field => field.name === "Current Duration");
    if (currentDurationField) {
      currentDurationField.value = `\`[${formatTime(currentTime)} / ${nowTrack.formattedDuration}]\``;
      nowplay.edit({ embeds: [embed], components: [row, row2] });
    }
  };

  intervalId = setInterval(updateCurrentDuration, 10000);
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}