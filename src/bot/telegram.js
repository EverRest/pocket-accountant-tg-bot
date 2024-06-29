const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config');
const token = config.telegramToken;
const bot = new TelegramBot(token, {polling: true});
const Database = require('../db/db');
const {dbPath} = require('../config/config');
const db = new Database(dbPath);
const {generateStarWarsName} = require('../utils/utils');
const {random} = require("lodash");

const opts = {
    reply_markup: {
        inline_keyboard: [
            [{text: 'New Project 🧑‍💻', callback_data: 'new_project'}],
            [{text: 'List Projects 👩‍💻', callback_data: 'list_projects'}],
            [{text: 'Buy Subscription 💸', callback_data: 'buy_subscription'}],
            [{text: 'Back 🔙', callback_data: 'back_button'}],
        ]
    }
};

async function handleIncomeOutcome(chatId, projectId, isIncome) {
    const action = isIncome ? 'income' : 'outcome';
    await bot.sendMessage(chatId, `Please enter the ${action} amount:`);
    bot.once('message', async (msg) => {
        const balance = (isIncome ? 1 : -1) * parseFloat(msg.text);
        const invoiceId = random(100000000, 999999999);
        const date = new Date();
        await db.accountantRepository.create(projectId, invoiceId, balance, date);
        await handleProjectSelection(chatId, projectId);
    });
}

async function handleProjectSelection(chatId, projectId) {
    const project = await db.projectRepository.getById(projectId);
    if (project) {
        await bot.sendMessage(chatId, `You selected project: ${project.name}`);
        const projectOpts = {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Income 💰', callback_data: `income_${projectId}`}],
                    [{text: 'Outcome 💵', callback_data: `outcome_${projectId}`}],
                    [{text: 'Report 🧾', callback_data: `report_${projectId}`}],
                    [{text: 'Back 🔙', callback_data: 'back_button'}],
                ]
            }
        };
        await bot.sendMessage(chatId, 'What would you like to do next?', projectOpts);
    } else {
        await bot.sendMessage(chatId, 'Project not found.');
    }
}

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    let user = await db.customerRepository.get(chatId);
    if (!user) {
        const name = generateStarWarsName();
        user = await db.customerRepository.create(chatId, name);
    }
    if (user) {
        await bot.sendMessage(chatId, `Hello ${user.name} 👽 please choose an option:`, opts);
    } else {
        console.log('User is undefined');
    }
});

bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    if (data.startsWith('income_')) {
        const projectId = data.split('_')[1];
        await handleIncomeOutcome(chatId, projectId, true);
    } else if (data.startsWith('outcome_')) {
        const projectId = data.split('_')[1];
        await handleIncomeOutcome(chatId, projectId, false);
    } else if (data.startsWith('project_')) {
        const projectId = data.split('_')[1];
        await handleProjectSelection(chatId, projectId);
    }
    if (data.startsWith('report_')) {
        const projectId = data.split('_')[1];
        const records = await db.accountantRepository.getCollectionByProjectId(projectId);
        const dailyStats = {};
        records.forEach(record => {
            const day = record.date.toISOString().split('T')[0];
            if (!dailyStats[day]) {
                dailyStats[day] = {income: 0, outcome: 0, invoices: []};
            }
            if (record.balance > 0) {
                dailyStats[day].income += record.balance;
            } else {
                dailyStats[day].outcome += record.balance;
            }
            dailyStats[day].invoices.push(record.invoiceId);
        });
        let report = 'Report for project:\n';
        for (const [day, stats] of Object.entries(dailyStats)) {
            const profitDeficit = stats.income + stats.outcome;
            report += `\nFor ${day}:\nIncome: ${stats.income}\nOutcome: ${-stats.outcome}\nProfit/Deficit: ${profitDeficit}\nInvoices: ${stats.invoices.join(', ')}\n`;
        }
        await bot.sendMessage(chatId, report);
    }
    switch (data) {
        case 'new_project':
            await bot.sendMessage(chatId, 'Please enter the name of the new project:');
            bot.once('message', async (msg) => {
                const name = msg.text;
                const project = await db.projectRepository.get(chatId, name);
                if (!project) {
                    await db.projectRepository.create(chatId, name);
                }
                await bot.sendMessage(chatId, 'Project created. What would you like to do next?', opts);
            });
            break;
        case 'list_projects':
            const projects = await db.projectRepository.getCollectionByChatId(chatId);
            if (projects && projects.length > 0) {
                const projectButtons = projects.map(project => [{
                    text: project.name,
                    callback_data: `project_${project._id}`
                }]);
                const opts = {reply_markup: {inline_keyboard: projectButtons}};
                await bot.sendMessage(chatId, 'Here are your projects:', opts);
            } else {
                await bot.sendMessage(chatId, 'You have no projects.');
            }
            break;
        case 'buy_subscription':
            const user = await db.customerRepository.get(chatId);
            if (user) {
                user.subscription = true;
                await db.customerRepository.update(chatId, user.name, user.subscription);
                await bot.sendMessage(chatId, 'You are subscribed successfully.', opts);
            } else {
                await bot.sendMessage(chatId, 'User not found.');
            }
            break;
        case 'back_button':
            await bot.sendMessage(chatId, 'What would you like to do next?', opts);
            break;
    }
});

module.exports = bot;