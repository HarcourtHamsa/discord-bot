const { Client, Events, IntentsBitField } = require('discord.js')
require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ]
})

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    // console.log(`Servers Available: ${readyClient.fetchInvite}`);
    readyClient.guilds
});

client.on('guildAvailable', (guild) => {
    console.log(`Joined Discord Server ${guild.id}`);
})

client.on('guildMemberAdd', (member) => {
    const userId = process.env.ADMIN_USER_ID; // Replace with the user's ID

    client.users.fetch(userId).then(user => {
        user.send(`Hello! This is a message from the bot.  ${member.user.displayName} joined the ${member.guild.name} server`);
    }).catch(console.error);
})


// Log in to Discord with your client's token
client.login(
    process.env.DISCORD_TOKEN
)