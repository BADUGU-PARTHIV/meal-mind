const db = require('../config/db');

const createBudget = (budgetData, callback) => {

    const sql = `
        INSERT INTO budgets
        (
            user_id,
            budget_type,
            amount
        )
        VALUES (?, ?, ?)
    `;

    db.query(sql, [
        budgetData.user_id,
        budgetData.budget_type,
        budgetData.amount
    ], callback);

};

module.exports = {
    createBudget
};