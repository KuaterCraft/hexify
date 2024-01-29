const { white, yellow } = require('chalk');

module.exports = async (client) => {
    console.log(chalk.yellow(chalk.magenta(`Hexify`)), (chalk.white(`|`)), chalk.green(`Reconnected`), chalk.blue(`${client.user.tag} (${client.user.id})`))
};