const { Database } = require("st.db");
const chalk = require('chalk');

module.exports = async (client) => {
    console.log(chalk.magenta(chalk.bold(`Hexify`)), chalk.white(`|`), chalk.green(`Database`), chalk.green(`Online!`));

    client.createExSetup = async function (interaction) {
        const db = new Database(`./src/database/models/setup.json`, { databaseInObject: true });
        const database = await db.has(interaction.guild.id);
        if (!database) {
            await db.set(interaction.guild.id, {
                setup_enable: false,
                setup_msg: "",
                setup_ch: "" 
            });
        }
    };

    client.createAlreadySetup = async function (interaction) {
        const db = new Database(`./src/database/models/setup.json`, { databaseInObject: true });
        await db.set(interaction.guild.id, {
            setup_enable: false,
            setup_msg: "",
            setup_ch: "" 
        });
    };

    client.createSetup = async function (interaction, channel, message) {
        const db = new Database(`./src/database/models/setup.json`, { databaseInObject: true });
        await db.set(interaction.guild.id, {
            setup_enable: true,
            setup_msg: message,
            setup_ch: channel 
        });
    }

    client.createEVoice = async function (interaction) {
        const db = new Database(`./src/database/models/voice.json`, { databaseInObject: true });
        await db.set(interaction.guild.id, {
            voice_enable: true,
        });
    }

    client.createDVoice = async function (interaction) {
        const db = new Database(`./src/database/models/voice.json`, { databaseInObject: true });
        await db.set(interaction.guild.id, {
            voice_enable: false,
        });
    }

    client.createExVoice = async function (interaction) {
        const db = new Database(`./src/database/models/voice.json`, { databaseInObject: true });
        const database = await db.has(interaction.guild.id);
        if (!database) {
            await db.set(interaction.guild.id, {
                voice_enable: false,
            });
        }
    }

    client.createPlay = async function (interaction, message) {
        const db = new Database(`./src/database/models/message.json`, { databaseInObject: true });
        await db.set(interaction.guild.id, {
            channel_id: interaction.channel.id,
            message_id: message
        });
    };

    client.addCount = async function (cmdname) {
        const db = new Database(`./src/database/models/stats.json`, { databaseInObject: true });
        await db.add({ key: cmdname, value: 1 });
    }

    client.addChart = async function (id) {
        const db = new Database(`./src/database/models/chart.json`, { databaseInObject: true });
        await db.add({ key: id, value: 1 });
    }


    client.interval = null;

    client.clearInterval = async function (interval) {
        clearInterval(interval);
    }

};
