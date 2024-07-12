const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrate')
        .setDescription('Rate a server')
        .addIntegerOption(option => 
            option.setName('rating')
                .setDescription('The rating from 1 to 5')
                .setRequired(true)),
    async execute(interaction) {
        const rating = interaction.options.getInteger('rating');
        if (rating < 1 || rating > 5) {
            return interaction.reply({ content: 'Rating must be between 1 and 5!', ephemeral: true });
        }

        db.get('SELECT logChannelId FROM channels WHERE guildId = ?', [interaction.guild.id], (err, row) => {
            if (err) {
                console.error(err.message);
                return interaction.reply({ content: 'Fehler beim Abrufen des Log-Kanals.', ephemeral: true });
            }

            if (!row || !row.logChannelId) {
                return interaction.reply({ content: 'Log-Kanal wurde nicht gesetzt.', ephemeral: true });
            }

            const logChannelId = row.logChannelId;
            const logChannel = interaction.guild.channels.cache.get(logChannelId);
            if (!logChannel) {
                return interaction.reply({ content: 'Log-Kanal nicht gefunden.', ephemeral: true });
            }

            logChannel.send(`Rating received: ${rating} stars from ${interaction.user.tag}`);
            interaction.reply({ content: 'Vielen Dank für die Bewertung!', ephemeral: true });
        });
    }
};
