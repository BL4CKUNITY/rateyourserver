const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setratelog')
        .setDescription('Setzt den Log-Kanal für die Bewertungen')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Der Log-Kanal für die Bewertungen')
                .setRequired(true)),
    async execute(interaction) {
        const logChannel = interaction.options.getChannel('channel');
        db.run('INSERT OR REPLACE INTO channels (guildId, logChannelId) VALUES (?, ?)', [interaction.guild.id, logChannel.id], err => {
            if (err) {
                console.error(err.message);
                return interaction.reply({ content: 'Fehler beim Setzen des Log-Kanals.', ephemeral: true });
            }

            interaction.reply({ content: `Der Log-Kanal wurde auf ${logChannel} gesetzt.`, ephemeral: true });
        });
    }
};
