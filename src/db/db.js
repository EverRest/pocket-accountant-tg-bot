const mongoose = require('mongoose');
const CustomerRepository = require('./customers');
const ProjectRepository = require('./projects');
const AccountantRepository = require('./accountants');
const timeOut = 60000;

class Database {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.connectionOptions = {
            socketTimeoutMS: timeOut,
            connectTimeoutMS: timeOut,
        };
        this.connect();
        this.customerRepository = new CustomerRepository();
        this.projectRepository = new ProjectRepository();
        this.accountantRepository = new AccountantRepository();
    }

    connect() {
        try {
            mongoose.connect(this.connectionString, this.connectionOptions);
            console.log('Database connection successful');
        } catch (error) {
            console.error('Database connection error:', error);
        }
    }
}

module.exports = Database;