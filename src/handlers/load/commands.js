const Discord = require('discord.js');
const { REST } = require('discord.js');
const { Routes } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');

module.exports = (client) => {
    const interactionLogs = new Discord.WebhookClient({
        id: client.config.WEBHOOK_ID,
        token: client.config.WEBHOOK_TOKEN,
    });

    const commands = [];

    if (client.shard.ids[0] === 0) console.log(chalk.magenta(chalk.bold(`Hexify`)), (chalk.white(`|`)), (chalk.green(`Loading commands`)), (chalk.white(`...`)))
    if (client.shard.ids[0] === 0) console.log(`\u001b[0m`);

    fs.readdirSync('./src/interactions').forEach(dirs => {
        const commandFiles = fs.readdirSync(`./src/interactions/${dirs}`).filter(files => files.endsWith('.js'));

        if (client.shard.ids[0] === 0) console.log(chalk.magenta(chalk.bold(`Hexify`)), (chalk.white(`|`)), chalk.red(`${commandFiles.length}`), (chalk.green(`commands of`)), chalk.red(`${dirs}`), (chalk.green(`loaded`)));

        for (const file of commandFiles) {
            const command = require(`${process.cwd()}/src/interactions/${dirs}/${file}`);
            client.commands.set(command.data.name, command);
            commands.push(command.data);
        };
    });

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    (async () => {
        try {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`Started refreshing application (/) commands.`)
                .setColor(client.config.EMBED_COLOR)
            interactionLogs.send({
                username: 'Bot Logs',
                embeds: [embed]
            });

            await rest.put(
                Routes.applicationCommands(process.env.DISCORD_ID),
                { body: commands },
            )

            const embedFinal = new Discord.EmbedBuilder()
                .setDescription(`Successfully reloaded ${commands.length} application (/) commands.`)
                .setColor(client.config.EMBED_COLOR)
            interactionLogs.send({
                username: 'Bot Logs',
                embeds: [embedFinal]
            });

        } catch (error) {
            console.log(error);
        }
    })();
}

 