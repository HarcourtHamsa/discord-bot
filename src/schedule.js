const { fetchGuildMembers } = require("./utils/utils");
const { Client: SelfBotClient } = require("discord.js-selfbot-v13");
const cron = require("node-cron");
const creationDateTimestamp = new Date().getTime();

const selfBotClient = new SelfBotClient();

selfBotClient.once("ready", () => {
  console.log("Self bot connected 🤖");
});

cron.schedule("*/2 * * * *", async () => {
  console.log("Running cron job");
  await fetchGuildMembers(
    process.env.GUILD_ID,
    selfBotClient,
    creationDateTimestamp,
  );
});

selfBotClient.login(process.env.USER_TOKEN);
