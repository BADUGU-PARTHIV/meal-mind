const { createBudget } = require('../models/budgetModel');

const addBudget = (req, res) => {

    const budgetData = {
        user_id: req.user.id,
        budget_type: req.body.budget_type,
        amount: req.body.amount
    };

    createBudget(
        budgetData,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: 'Budget Creation Failed'
                });
            }

            res.status(201).json({
                message: 'Budget Added Successfully'
            });

        }
    );

};

module.exports = {
    addBudget
};