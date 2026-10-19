const {
    getTodayWaterByUserId,
    addWaterByUserId
} = require('../models/waterModel');

const getWater = (req, res) => {
    getTodayWaterByUserId(req.user.id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed To Load Water' });
        }

        res.json({ amount: Number(results[0].amount) });
    });
};

const addWater = (req, res) => {
    const amount = Number(req.body.amount);

    if (!Number.isInteger(amount) || amount <= 0 || amount > 5000) {
        return res.status(400).json({ message: 'Enter A Valid Water Amount' });
    }

    addWaterByUserId(req.user.id, amount, (error) => {
        if (error) {
            return res.status(500).json({ message: 'Failed To Add Water' });
        }

        res.status(201).json({ message: 'Water Added Successfully' });
    });
};

module.exports = {
    getWater,
    addWater
};
