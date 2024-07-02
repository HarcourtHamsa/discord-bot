const { fetchGuildMembers } = require("./utils/utils");
const { Client: SelfBotClient } = require('discord.js-selfbot-v13');
const cron = require('node-cron');


const selfBotClient = new SelfBotClient()

selfBotClient.once('ready', () => {
    console.log("Self bot connected 🤖")
})

// Schedule the cron job to run every 20 minutes
cron.schedule('*/1 * * * *', async () => {
    console.log('Running cron job to fetch guild members');
    await fetchGuildMembers(process.env.GUILD_ID, selfBotClient);
});

// Log in to Discord account's token
selfBotClient.login(process.env.USER_TOKEN)
