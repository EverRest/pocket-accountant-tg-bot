const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    chatId: {type: String, required: true},
    name: {type: String, required: true},
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;