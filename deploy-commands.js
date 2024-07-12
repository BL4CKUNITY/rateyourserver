const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('setratelog')
        .setDescription('Setzt den Log-Kanal für die Bewertungen')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Der Log-Kanal für die Bewertungen')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('setrate')
        .setDescription('Rate a server')
        .addIntegerOption(option => 
            option.setName('rating')
                .setDescription('The rating from 1 to 5')
                .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
