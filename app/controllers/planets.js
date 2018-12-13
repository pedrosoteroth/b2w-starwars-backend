const {
    Types
} = require('mongoose');
const {
    Planet
} = require('../models/planet');

const {
    getPlanet
} = require('../services/swapi');

const find = async (req, res) => {
    const {
        name
    } = req.query;

    let planets;
    try {
        if (name) {
            planets = await Planet.find({
                name
            });
        } else {
            planets = await Planet.find({});
        }

        res.status(200);
        if (planets.length) res.send(planets);
        else res.send('Wow such empty galaxy');
    } catch (e) {
        res.status(500);
        res.send(e.message);
    }
};

const findById = (req, res) => Planet.findById(req.params.id)
    .then((planet) => {
        res.status(200);
        if (planet) res.send(`You reach ${planet.name} such luck`);
        else res.send('You lost yourself in the galaxy');
    })
    .catch((err) => {
        res.status(500);
        res.send(err.message);
    });

const add = async (req, res) => {
    const {
        name,
        climate,
        terrain
    } = req.body;
    try {
        const result = await getPlanet(name);
        if (result.results[0]) {
            const {
                lastErrorObject
            } = await Planet.findOneAndUpdate({
                name
            }, {
                name,
                terrain,
                climate,
                apparitions: result.results[0].films.length
            }, {
                upsert: true,
                new: true,
                rawResult: true
            });
            res.status(200);
            if (lastErrorObject && !lastErrorObject.updatedExisting) res.send(`Are you a god ? you just created ${name} from nothing`);
            else res.send(`Another Jedi created ${name} already`);
        } else {
            res.status(404);
            res.send(`
            Patience you must have, my young padawan. 
            Train yourself to let go of everything you fear to lose.
            Then you will be powerful enough to create ${name}`);
        }
    } catch (e) {
        res.status(500);
        res.send(e.message);
    }
};

const destroy = async (req, res) => {
    try {
        const castId = Types.ObjectId(req.params.id);
        const planet = await Planet.findOneAndRemove({
            _id: castId
        });
        res.status(200);
        res.send(`Such power, you destroyed ${planet.name} with just one hand.`);
    } catch (e) {
        res.status(500);
        res.send(e.message);
    }
};

module.exports = {
    find,
    findById,
    add,
    destroy
};