const Discord = require('discord.js');
const chalk = require('chalk');
require('dotenv').config('./.env');

const manager = new Discord.ShardingManager('./src/bot.js', {
    totalShards: 'auto',
    token: process.env.DISCORD_TOKEN,
    respawn: true
});
manager.on('shardCreate', shard => {
    console.log(chalk.yellow(chalk.magenta(`Hexify`)), (chalk.white(`|`)), chalk.green(`Shard`), chalk.red(`#${shard.id + 1}!`))
});
manager.spawn();
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
    if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
});

process.on('warning', warn => {
    console.warn("Warning:", warn);
        console.log(warn)
});
