const { fetchGuildMembers } = require("./utils/utils");
const { Client: SelfBotClient } = require("discord.js-selfbot-v13");
const cron = require("node-cron");

const selfBotClient = new SelfBotClient();

selfBotClient.once("ready", () => {
  console.log("Self bot connected 🤖");
});

cron.schedule("*/5 * * * *", async () => {
  console.log("Running cron job to fetch guild members");
  await fetchGuildMembers(process.env.GUILD_ID, selfBotClient);
});

selfBotClient.login(process.env.USER_TOKEN);
