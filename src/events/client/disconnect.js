const { white, yellow } = require('chalk');

module.exports = async (client) => {
    console.log(chalk.yellow(chalk.magenta(`Hexify`)), (chalk.white(`|`)), chalk.red(`Disconnected`), chalk.blue(`${client.user.tag} (${client.user.id})`))
};

