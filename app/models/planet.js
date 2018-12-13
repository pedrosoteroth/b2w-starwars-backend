const mongoose = require('mongoose');

const conn = mongoose.createConnection('mongodb://192.168.99.100:27017/b2wstarwars');

const planetSchema = new mongoose.Schema({
    name: String,
    terrain: String,
    climate: String,
    apparitions: String
});

const Planet = conn.model('Planet', planetSchema, 'Planet');

module.exports = {
    Planet
};