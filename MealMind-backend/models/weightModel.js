const db = require('../config/db');

const getWeightsByUserId = (userId, callback) => {
    const sql = `
        SELECT id, weight, created_at
        FROM weight_logs
        WHERE user_id = ?
        ORDER BY created_at DESC, id DESC
    `;

    db.query(sql, [userId], callback);
};

const addWeightByUserId = (userId, weight, callback) => {
    const sql = `
        INSERT INTO weight_logs (user_id, weight)
        VALUES (?, ?)
    `;

    db.query(sql, [userId, weight], callback);
};

module.exports = {
    getWeightsByUserId,
    addWeightByUserId
};
