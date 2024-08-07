const { Client, Collection, Events, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');
const { SpotifyPlugin } = require("@distube/spotify");
const { clientId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { DisTube } = require('distube');
const db = require('./database/controlador');
const https = require('https');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.setMaxListeners(100);

const distube = new DisTube(client, {
    plugins: [new SpotifyPlugin()],
    emitNewSongOnly: true,
});
module.exports = distube;

const commands = [];
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST({ version: '10' }).setToken(token);
const timeoutDuration = 120000;

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const requestOptions = {
            hostname: 'discord.com',
            path: Routes.applicationCommands(clientId),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bot ${token}`
            }
        };

        const req = https.request(requestOptions, response => {
            let data = '';

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
            });
        });

        req.on('error', error => {
            console.error(error);
        });

        req.setTimeout(timeoutDuration, () => {
            req.abort();
        });

        req.end();

    } catch (error) {
        console.error(error);
    }
})();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, distube);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.once(Events.ClientReady, async c => {
    client.user.setActivity('Tamo on! 👽', { type: ActivityType.Listening });
    console.log(`Logged in! Tamo on carai! 💀 ${client.user.username}`);

    try {
        await db.startDB();
        console.log('Database started');
    } catch (e) {
        console.log(`Error starting database: ${e}`);
    }
});

client.login(token);
