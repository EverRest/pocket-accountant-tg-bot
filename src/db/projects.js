const Project = require('../models/Project');

class ProjectRepository {
    async create(chatId, name) {
        try {
            const project = new Project({chatId, name});
            await project.save();
            return project;
        } catch (error) {
            console.error('Error creating project:', error);
        }
    }

    async get(chatId, name) {
        try {
            return await Project.findOne({chatId, name});
        } catch (error) {
            console.error('Error getting project:', error);
        }
    }

    async getById(_id) {
        try {
            return await Project.findOne({_id});
        } catch (error) {
            console.error('Error getting project:', error);
        }
    }

    async getCollectionByChatId(chatId) {
        try {
            return await Project.find({chatId});
        } catch (error) {
            console.error('Error getting projects:', error);
        }
    }

    async update(chatId, name, subscription) {
        try {
            await Project.updateOne({chatId}, {name, subscription});
        } catch (error) {
            console.error('Error updating project:', error);
        }
    }

    async delete(chatId) {
        try {
            await Project.deleteOne({chatId});
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    }
}

module.exports = ProjectRepository;
