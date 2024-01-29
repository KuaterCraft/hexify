const Discord = require('discord.js');
const chalk = require('chalk');
const { random } = require('mathjs');
const fs = require('fs');
const { ActivityType } = require("discord.js")
const path = require('path');
const bannedUsersFilePath = path.join(process.cwd(), 'src', 'database', 'banned_users.json');
module.exports = async (client, node) => {

    console.log(`\u001b[0m`);
    console.log(chalk.magenta(chalk.bold(`Hexify`)), (chalk.white(`|`)), chalk.red(`Shard #${client.shard.ids[0] + 1}`), chalk.green(`is ready!`))
    console.log(chalk.magenta(chalk.bold(`Hexify`)), (chalk.white(`|`)), chalk.green(`Started on`), chalk.red(`${client.guilds.cache.size}`), chalk.green(`servers!`))

    setInterval(async function () {
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
        ];
        return Promise.all(promises)
            .then(async results => {
                let statuttext;
                if (process.env.DISCORD_STATUS) {
                    statuttext = process.env.DISCORD_STATUS.split(', ');
                } else {
                    statuttext = [
                        `Playing music for hexify!`,
                    ];
                }
                const randomText = statuttext[Math.floor(Math.random() * statuttext.length)];
                try {
                    await client.user.setPresence({ 
                        status: `${process.env.STATUS}`,
                        activities: [{
                            name: "customstatus",
                            type: ActivityType.Custom,
                            state: randomText,
                            url: "https://Hexify.fr.to/",
                            emoji: "<:fverified_dev:1064768594505904138>"
                        }]
                     });
                } catch (error) { }
            })
    }, 5000)
}
