const { readdirSync } = require("fs");
const chalk = require("chalk")
module.exports = async (client) => {
    try {
        readdirSync("./src/events/distube/").forEach(file => {
            const event = require(`../../events/distube/${file}`);
            let eventName = file.split(".")[0];
            client.distube.on(eventName, event.bind(null, client));
          });
    } catch (e) {
        console.log(chalk.magenta(chalk.bold(`Hexify`)), (chalk.white(`|`)), chalk.green(`Player Events | Music Player`), chalk.red(`Error!`))
        console.log(e);
    }
};