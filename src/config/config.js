require("dotenv").config();

module.exports = {
    TOKEN: process.env.DISCORD_TOKEN || "BOT TOKEN",  // bot token
    BOTID: process.env.DISCORD_ID || "BOT ID", // bot id
    OWNER_ID: process.env.OWNER_ID || "YOUR_ID", // your id
    EMBED_COLOR: "#" + process.env.EMBED_COLOR || "#9900ff", // embed message color!
    EMBED_FOOTER: process.env.EMBED_FOOTER || `© Hexify ${new Date().getFullYear()}`,
    // Default autocomplete search
    SEARCH_DEFAULT: process.env.SEARCH_DEFAULT ? process.env.SEARCH_DEFAULT.split(",") : ["all"],
    // Leave voice empty
    LEAVE_EMPTY: parseInt(process.env.LEAVE_EMPTY) || 120000, // 1000 = 1 sec

    // Spotify support playlist more 100+ track || false = default || Can get from here: https://developer.spotify.com/dashboard/applications
    SPOTIFY_TRACKS: process.env.SPOTIFY_TRACKS ? process.env.SPOTIFY_TRACKS === "true" : false,
    SPOTIFY_ID: process.env.SPOTIFY_ID || "SPOTIFY_CLIENT_ID",
    SPOTIFY_SECRET: process.env.SPOTIFY_SECRET || "SPOTIFY_CLIENT_SECRET",
    // WEBHOOK
    // go to server settings -> integrations -> webhooks -> create one and copy url. You will get something like this below 
    // https://discord.com/api/webhooks/1199385584996962481/nAHIRbSWJeiKolakJoovuzY0G02MG0-0HpufU8sQ-irs1th7LXLv-BZ-Fh82tHWiIQQI
    // "1199385584996962481" is webhook id and the rest part
    // "nAHIRbSWJeiKolakJoovuzY0G02MG0-0HpufU8sQ-irs1th7LXLv-BZ-Fh82tHWiIQQI" is webhook token.
    WEBHOOK_ID: process.env.WEBHOOK_ID || "", // WEBHOOK ID
    WEBHOOK_TOKEN: process.env.WEBHOOK_TOKEN || "", // WEBHOOK TOKEN
    LICENSE_KEY: process.env.LICENSE_KEY || ""
};