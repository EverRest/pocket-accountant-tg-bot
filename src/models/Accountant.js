const mongoose = require('mongoose');

const accountantSchema = new mongoose.Schema({
    projectId: {type: String, required: true},
    invoiceId: {type: String, required: true},
    balance: {type: Number, required: true},
    date: {type: Date, required: true},
});

const Accountant = mongoose.model('Accountant', accountantSchema);

module.exports = Accountant;