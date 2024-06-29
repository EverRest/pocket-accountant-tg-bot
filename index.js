const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const {applicationPort, environment} = require("./src/config/config");
const config = require('./src/config/config');
const bot = require('./src/bot/telegram');
const winston = require('winston');
const utils = require('./src/utils/utils');
const express = require('express');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'}),
    ],
});

if (environment !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

const app = express();
const port = applicationPort || 8080;

async function initialize() {
    app.get('/', (req, res) => {
        res.send('Hello webhook!');
    });

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });
}

initialize().catch(console.error);