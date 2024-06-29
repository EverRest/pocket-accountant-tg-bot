const Accountant = require('../models/Accountant');

class AccountantRepository {
    async create(projectId, invoiceId, balance, date) {
        try {
            const accountant = new Accountant({projectId, invoiceId, balance, date});
            await accountant.save();
            return accountant;
        } catch (error) {
            console.error('Error creating accountant:', error);
        }
    }

    async getById(_id) {
        try {
            return await Accountant.findOne({_id});
        } catch (error) {
            console.error('Error getting accountant:', error);
        }
    }

    async getCollectionByProjectId(projectId) {
        try {
            return await Accountant.find({projectId});
        } catch (error) {
            console.error('Error getting accountant:', error);
        }
    }

    async update(chatId, name, subscription) {
        try {
            await Accountant.updateOne({chatId}, {name, subscription});
        } catch (error) {
            console.error('Error updating accountant:', error);
        }
    }

    async delete(_id) {
        try {
            await Accountant.deleteOne({_id});
        } catch (error) {
            console.error('Error deleting accountant:', error);
        }
    }
}

module.exports = AccountantRepository;
