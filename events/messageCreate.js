const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');
const ratingOptions = require('../utils/ratingOptions');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.content === '!rate') {
            db.get('SELECT rateChannelId FROM channels WHERE guildId = ?', [message.guild.id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    return;
                }

                if (row && row.rateChannelId) {
                    const rateChannel = message.guild.channels.cache.get(row.rateChannelId);
                    if (rateChannel) {
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
                    }
                } else {
                    message.reply('Der Bewertungskanal wurde noch nicht gesetzt.');
                }
            });
        }
    }
};
