const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    chatId: {type: String, required: true},
    name: {type: String, required: true},
    subscription: {type: Boolean, default: false},
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;