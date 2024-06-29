require('dotenv').config();

module.exports = {
    telegramToken: process.env.TELEGRAM_TOKEN,
    applicationPort: process.env.APPLICATION_PORT,
    environment: process.env.NODE_ENV,
    dbPath: process.env.DATABASE_URL,
};