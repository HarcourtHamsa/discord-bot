const fs = require('fs').promises;
const path = require('path');

async function fetchGuildMembers(id, selfBotClient) {
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

            // Filter out members who already exist in the JSON file
            const newMembers = members.filter(member => !existingMemberNames.has(member.user.username));

            // Add new members to the list
            const updatedMembers = [
                ...existingMembers,
                ...newMembers.map(member => ({ name: member.user.username })),
            ];

            const updatedMemberNames = new Set(updatedMembers.map(member => member.name));

            const noChangesMade = isEqualSet(existingMemberNames, updatedMemberNames);

            if (noChangesMade) {
                console.log("No new members")
                return;
            }

            // Write the updated members list to the JSON file
            try {
                await fs.writeFile(filePath, JSON.stringify(updatedMembers, null, 2), 'utf8');
            } catch (error) {
                console.log(error);
            }

            // Send a message to each new member
            const promises = newMembers.map(async (member) => {
                try {
                    await sendMessage(selfBotClient, member.user.username);

                } catch (error) {
                    console.log(error)
                }
            });

            await Promise.all(promises);

            console.log('All messages sent successfully.');
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    } else {
        console.error(`Guild with ID ${id} not found.`);
    }
}

async function sendMessage(selfBotClient, username) {
    const user = await selfBotClient.users.cache.get(process.env.RECIPIENT_ACCOUNT_ID);

    if (user) {
        user.send(`Hello, this is an automated message. A user with username ${username} just joined the server`)
            .then(() => console.log('Message sent successfully ✅.'))
            .catch(console.error);
    } else {
        console.error('User not found.');
    }
}

// Compare the two sets
function isEqualSet(setA, setB) {
    if (setA.size !== setB.size) return false;
    for (let item of setA) {
        if (!setB.has(item)) return false;
    }
    return true;
}

module.exports = { fetchGuildMembers };
