const { InteractionType } = require('discord.js');
const db = require('../utils/database');
const ratingOptions = require('../utils/ratingOptions');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isStringSelectMenu()) {
            const userId = interaction.user.id;
            const rating = interaction.values[0];

            db.run('INSERT OR REPLACE INTO ratings (userId, rating) VALUES (?, ?)', [userId, rating], err => {
                if (err) {
                    console.error(err.message);
                    return interaction.reply({ content: 'Fehler beim Speichern der Bewertung.', ephemeral: true });
                }

                db.get('SELECT logChannelId FROM channels WHERE guildId = ?', [interaction.guild.id], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return;
                    }

                    if (row && row.logChannelId) {
                        const logChannel = interaction.guild.channels.cache.get(row.logChannelId);
                        if (logChannel) {
                            logChannel.send(`Benutzer ${interaction.user.username} (${interaction.user.id}) hat den Server mit ${rating} Sternen bewertet.`);
                        }
                    }

                    interaction.reply({ content: `Danke für deine Bewertung! Du hast ${rating} Sterne gegeben.`, ephemeral: true });

                    const thankYouMessages = [
                        'Es hat mir nicht so gefallen',
                        'Es hat mir gefallen',
                        'Es hat mir sehr gefallen',
                        'Es hat mir sehr Spaß gemacht',
                        'Es ist hervorragend'
                    ];

                    interaction.channel.send(`Vielen Dank für deine Bewertung! ${interaction.user} hat den Server mit ${rating} Stern(en) bewertet: ${thankYouMessages[parseInt(rating) - 1]}`);
                });
            });
        }
    }
};
