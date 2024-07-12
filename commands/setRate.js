const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');
const ratingOptions = require('../utils/ratingOptions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrate')
        .setDescription('Setzt den Kanal für die Bewertungen')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Der Kanal für die Bewertungen')
                .setRequired(true)),
    async execute(interaction) {
        const rateChannel = interaction.options.getChannel('channel');
        db.run('INSERT OR REPLACE INTO channels (guildId, rateChannelId) VALUES (?, ?)', [interaction.guild.id, rateChannel.id], err => {
            if (err) {
                console.error(err.message);
                return interaction.reply({ content: 'Fehler beim Setzen des Bewertungskanals.', ephemeral: true });
            }

            interaction.reply({ content: `Der Bewertungskanal wurde auf ${rateChannel} gesetzt.`, ephemeral: true });

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('select')
                        .setPlaceholder('Wähle eine Bewertung')
                        .addOptions(ratingOptions)
                );

            const embed = new EmbedBuilder()
                .setTitle('Bewerte den Server')
                .setDescription('Bitte wähle eine Bewertung aus dem Dropdown-Menü unten aus.');

            rateChannel.send({ embeds: [embed], components: [row] });
        });
    }
};
