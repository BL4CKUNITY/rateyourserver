const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(process.env.DATABASE_PATH || 'ratings.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS ratings (userId TEXT PRIMARY KEY, rating INTEGER)');
            db.run('CREATE TABLE IF NOT EXISTS channels (guildId TEXT PRIMARY KEY, rateChannelId TEXT, logChannelId TEXT)');
        });
    }
});

module.exports = db;
