const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = async (client) => {
    const createButton = (style, customId, emoji) => {
        return new ButtonBuilder().setStyle(style).setCustomId(customId).setEmoji(`${emoji}`).setDisabled(false);
    };
    client.enSwitch = new ActionRowBuilder()
        .addComponents([
            createButton(ButtonStyle.Secondary, "spause", client.emotes.RESUME_ID),
            createButton(ButtonStyle.Secondary, "sprevious", client.emotes.PREVIOUS_ID),
            createButton(ButtonStyle.Danger, "sstop", client.emotes.PAUSE_ID),
            createButton(ButtonStyle.Secondary, "sskip", client.emotes.FORWARD_ID),
            createButton(ButtonStyle.Secondary, "sloop", client.emotes.REFRESH_ID),
        ]);

    client.enSwitch2 = new ActionRowBuilder()
        .addComponents([
            createButton(ButtonStyle.Secondary, "sshuffle", client.emotes.SHUFFLE_ID),
            createButton(ButtonStyle.Secondary, "svoldown", client.emotes.MINUS_ID),
            createButton(ButtonStyle.Secondary, "sclear", client.emotes.MUTED_ID),
            createButton(ButtonStyle.Secondary, "svolup", client.emotes.PLUS_ID),
            createButton(ButtonStyle.Secondary, "squeue", client.emotes.BOOK_ID),
        ]);

    client.diSwitch = new ActionRowBuilder()
        .addComponents([
            createButton(ButtonStyle.Secondary, "spause", client.emotes.RESUME_ID),
            createButton(ButtonStyle.Secondary, "sprevious", client.emotes.PREVIOUS_ID),
            createButton(ButtonStyle.Danger, "sstop", client.emotes.PAUSE_ID),
            createButton(ButtonStyle.Secondary, "sskip", client.emotes.FORWARD_ID),
            createButton(ButtonStyle.Secondary, "sloop", client.emotes.REFRESH_ID),
        ]);

    client.diSwitch2 = new ActionRowBuilder()
        .addComponents([
            createButton(ButtonStyle.Secondary, "sshuffle", client.emotes.SHUFFLE_ID),
            createButton(ButtonStyle.Secondary, "svoldown", client.emotes.MINUS_ID),
            createButton(ButtonStyle.Secondary, "sclear", client.emotes.MUTED_ID),
            createButton(ButtonStyle.Secondary, "svolup", client.emotes.PLUS_ID),
            createButton(ButtonStyle.Secondary, "squeue", client.emotes.BOOK_ID),
        ]);
};
