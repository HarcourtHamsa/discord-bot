const { Client, IntentsBitField } = require("discord.js");
const fs = require('fs').promises;
const path = require('path');

async function fetchGuildMembers(id, selfBotClient, creationDateTimestamp) {
  const guild = await selfBotClient.guilds.cache.get(id);

  if (guild) {
    try {
      const members = await guild.members.fetch();

      // Path to the JSON file
      const filePath = path.join(__dirname, 'members.json');

      // Read the existing members from the JSON file
      let existingMembers = [];

      try {
        const data = await fs.readFile(filePath, 'utf8');
        existingMembers = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error('Error reading the JSON file:', error);
          return;
        }
      }

      // Convert existing members to a Set for quick lookup
      const existingMemberNames = new Set(existingMembers.map(member => member.name));

      const newMembers = members.reduce((acc, member) => {
        const { joinedTimestamp } = member;
        const memberName = member.user.username;

        if (!existingMemberNames.has(memberName)) {
          if (creationDateTimestamp < joinedTimestamp) {
            acc.push({ name: memberName });
          }
        }


        return acc;
      }, []);

      console.log("%d new members", newMembers.length);



      if (newMembers.length > 0) {
        // Add new members to the list
        const updatedMembers = [
          ...existingMembers,
          ...newMembers,
        ];

        await fs.writeFile(filePath, JSON.stringify(updatedMembers, null, 2), 'utf8');

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
