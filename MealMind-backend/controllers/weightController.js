const {
    getWeightsByUserId,
    addWeightByUserId
} = require('../models/weightModel');

const getWeights = (req, res) => {
    getWeightsByUserId(req.user.id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed To Load Weights' });
        }

        res.json(results);
    });
};

const addWeight = (req, res) => {
    const weight = Number(req.body.weight);

    if (!Number.isFinite(weight) || weight <= 0 || weight > 500) {
        return res.status(400).json({ message: 'Enter A Valid Weight' });
    }

    addWeightByUserId(req.user.id, weight, (error) => {
        if (error) {
            return res.status(500).json({ message: 'Failed To Add Weight' });
        }

        res.status(201).json({ message: 'Weight Added Successfully' });
    });
};

module.exports = {
    getWeights,
    addWeight
};
