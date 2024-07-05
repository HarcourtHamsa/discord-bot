const { Client, IntentsBitField } = require("discord.js");

async function fetchGuildMembers(id, selfBotClient, creationDateTimestamp) {
  const guild = await selfBotClient.guilds.cache.get(id);

  if (guild) {
    try {
      const members = await guild.members.fetch();

      const newMembers = members.reduce((acc, member) => {
        const { joinedTimestamp } = member;
        const memberName = member.user.username;

        if (creationDateTimestamp < joinedTimestamp) {
          acc.push({ name: memberName });
        }

        return acc;
      }, []);

      console.log("%d new members", newMembers.length);

      if (newMembers.length > 0) {
        const newMemberNames = newMembers
          .map((member) => member.name)
          .join("\n");
        await sendMessage(selfBotClient, guild.name, newMemberNames);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  } else {
    console.error(`Guild with ID ${id} not found.`);
  }
}

async function sendMessage(selfBotClient, serverName, newMemberNames) {
  const discordClient = new Client({
    intents: [
      IntentsBitField.Flags.DirectMessages,
      IntentsBitField.Flags.GuildMembers,
    ],
  });

  discordClient.once("ready", async () => {
    console.log("Discord client connected ✅");

    const user = await discordClient.users.fetch(
      process.env.RECIPIENT_ACCOUNT_ID,
    );

    if (user) {
      user
        .send(
          `Hello, this is an automated message. The following users just joined ${serverName} server: \n ${newMemberNames}`,
        )
        .then(() => console.log("Message sent successfully ✅."))
        .catch(discordClient);
    } else {
      console.error("User not found.");
    }
  });

  discordClient.login(process.env.BOT_TOKEN);
}

function isEqualSet(setA, setB) {
  if (setA.size !== setB.size) return false;
  for (let item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
}

module.exports = { fetchGuildMembers };
