const Discord = require('discord.js');
const fs = require('fs');
const { Client, Collection, GatewayIntentBits, Partials, ShardEvents } = require("discord.js");
const { DisTube } = require('distube');
const chalk = require("chalk");
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const { DeezerPlugin } = require('@distube/deezer');

// Load environment variables
require('dotenv').config();

const client = new Discord.Client({
    allowedMentions: {
        parse: [
            'users',
            'roles'
        ],
        repliedUser: true
    },
    autoReconnect: true,
    disabledEvents: [
        "TYPING_START"
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.User,
        Discord.Partials.GuildScheduledEvent
    ],
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.GuildScheduledEvents,
        Discord.GatewayIntentBits.MessageContent
    ],
    restTimeOffset: 0
});

client.config = require("./config/config.js");
client.emotes = require("./config/emojis.json");

const fetchData = async () => {
    return await fetch("https://ferren.fr.to/hexifyAuth", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${client.config.LICENSE_KEY}`
        }
    })
        
        .then(response => {
            if (!response) {
                throw new Error("Is the license key valid?");
            }
            if (response.status !== 200) {
                throw new Error("Unauthorized. Get a license key at discord.gg/DfKpcAnU67");
            }
        })
        .catch(error => {
            console.error("Error while checking license:", error);
            throw new Error("Failed to check license. View console for details.");
        });
};

fetchData().then(async () => {
    client.distube = new DisTube(client, {
        leaveOnEmpty: false,
        emptyCooldown: 60,
        leaveOnFinish: false,
        leaveOnStop: true,
        plugins: [
            new SoundCloudPlugin(),
            new DeezerPlugin(),
            new SpotifyPlugin(),
            checkSpotify(client)
        ],
    });

    client.commands = new Discord.Collection();
    client.playerManager = new Map();

    fs.readdirSync('./src/handlers').forEach((dir) => {
        fs.readdirSync(`./src/handlers/${dir}`).forEach((handler) => {
            require(`./handlers/${dir}/${handler}`)(client);
        });
    });
})

const consoleLogs = new Discord.WebhookClient({
    id: client.config.WEBHOOK_ID,
    token: client.config.WEBHOOK_TOKEN,
});

const warnLogs = new Discord.WebhookClient({
    id: client.config.WEBHOOK_ID,
    token: client.config.WEBHOOK_TOKEN,
});

client.login(process.env.DISCORD_TOKEN);
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
    if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
    if (!error.stack) return
    const embed = new Discord.EmbedBuilder()
        .setTitle(`<:hcross:1199706326188691556>・Unhandled promise rejection`)
        .addFields([
            {
                name: "Error",
                value: error ? Discord.codeBlock(error) : "No error",
            },
            {
                name: "Stack error",
                value: error.stack ? Discord.codeBlock(error.stack) : "No stack error",
            }
        ])
        .setColor(client.config.EMBED_COLOR)
    consoleLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending unhandledRejection to webhook')
        console.log(error)
    })
});

process.on('warning', warn => {
    console.warn("Warning:", warn);
    const embed = new Discord.EmbedBuilder()
        .setTitle(`<:hcross:1199706326188691556>・New warning found`)
        .addFields([
            {
                name: `Warn`,
                value: `\`\`\`${warn}\`\`\``,
            },
        ])
        .setColor(client.config.EMBED_COLOR)
    warnLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending warning to webhook')
        console.log(warn)
    })
});

client.on(Discord.ShardEvents.Error, error => {
    console.log(error)
    if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
    if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
    if (!error.stack) return
    const embed = new Discord.EmbedBuilder()
        .setTitle(`<:hcross:1199706326188691556>・A websocket connection encountered an error`)
        .addFields([
            {
                name: `Error`,
                value: `\`\`\`${error}\`\`\``,
            },
            {
                name: `Stack error`,
                value: `\`\`\`${error.stack}\`\`\``,
            }
        ])
        .setColor(client.config.EMBED_COLOR)
    consoleLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    });
})
function checkSpotify(client) {
    if (client.config.SPOTIFY_TRACKS) {
        console.log(chalk.magenta(chalk.bold(`Hexify`)), (chalk.white(`|`)), chalk.green(`Spotify`), chalk.green(`More tracks support enabled!`));
        return spotifyOn(client);
    } else {
        console.log(chalk.magenta(chalk.bold(`Hexify`)), (chalk.white(`|`)), chalk.green(`Spotify`), chalk.red(`More tracks support not enabled!`));
        return spotifyOff();
    }
}

function spotifyOn(client) {
    return new SpotifyPlugin({
        emitEventsAfterFetching: true,
        api: {
            clientId: client.config.SPOTIFY_ID,
            clientSecret: client.config.SPOTIFY_SECRET
        }
    })
}

function spotifyOff() {
    return new SpotifyPlugin({
        emitEventsAfterFetching: true,
    })
}