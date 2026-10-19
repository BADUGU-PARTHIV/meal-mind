const db = require('../config/db');

const getTodayWaterByUserId = (userId, callback) => {
    const sql = `
        SELECT COALESCE(SUM(amount), 0) AS amount
        FROM water_logs
        WHERE user_id = ?
        AND DATE(created_at) = CURDATE()
    `;

    db.query(sql, [userId], callback);
};

const addWaterByUserId = (userId, amount, callback) => {
    const sql = `
        INSERT INTO water_logs (user_id, amount)
        VALUES (?, ?)
    `;

    db.query(sql, [userId, amount], callback);
};

module.exports = {
    getTodayWaterByUserId,
    addWaterByUserId
};
