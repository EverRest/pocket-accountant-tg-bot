const Customer = require('../models/Customer');

class CustomerRepository {
    async create(chatId, name, subscription = false) {
        try {
            const customer = new Customer({chatId, name, subscription});
            await customer.save();
            return customer;
        } catch (error) {
            console.error('Error creating customer:', error);
        }
    }

    async get(chatId) {
        try {
            return await Customer.findOne({chatId});
        } catch (error) {
            console.error('Error getting customer:', error);
        }
    }

    async update(chatId, name, subscription) {
        try {
            await Customer.updateOne({chatId}, {name, subscription});
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    }

    async delete(chatId) {
        try {
            await Customer.deleteOne({chatId});
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    }
}

module.exports = CustomerRepository;
