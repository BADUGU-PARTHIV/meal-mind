const db = require('../config/db');

const toDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const addDays = (date, days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

const getRange = (period, anchor) => {
    const date = new Date(`${anchor}T12:00:00`);

    if (period === 'weekly') {
        const mondayOffset = (date.getDay() + 6) % 7;
        const start = addDays(date, -mondayOffset);
        return { start, end: addDays(start, 6) };
    }

    if (period === 'monthly') {
        return {
            start: new Date(date.getFullYear(), date.getMonth(), 1, 12),
            end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 12)
        };
    }

    if (period === 'yearly') {
        return {
            start: new Date(date.getFullYear(), 0, 1, 12),
            end: new Date(date.getFullYear(), 11, 31, 12)
        };
    }

    return { start: date, end: date };
};

const query = (sql, params) => (
    new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    })
);

const getStatistics = async (req, res) => {
    try {
        const allowedPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
        const period = allowedPeriods.includes(req.query.period)
            ? req.query.period
            : 'weekly';
        const today = toDateString(new Date());
        const anchor = /^\d{4}-\d{2}-\d{2}$/.test(req.query.date || '')
            ? req.query.date
            : today;
        const { start, end } = getRange(period, anchor);
        const startDate = toDateString(start);
        const endDate = toDateString(end);

        const rows = await query(
            `SELECT
                DATE_FORMAT(consumed_date, '%Y-%m-%d') AS date,
                IFNULL(SUM(calories), 0) AS calories,
                IFNULL(SUM(protein), 0) AS protein,
                IFNULL(SUM(carbs), 0) AS carbs,
                IFNULL(SUM(fat), 0) AS fat,
                IFNULL(SUM(fiber), 0) AS fiber,
                COUNT(*) AS meal_count
             FROM food_logs
             WHERE user_id = ?
             AND DATE(consumed_date) BETWEEN ? AND ?
             GROUP BY DATE(consumed_date)
             ORDER BY DATE(consumed_date)`,
            [req.user.id, startDate, endDate]
        );

        const goalRows = await query(
            `SELECT calories, protein, carbs, fat, fiber
             FROM nutrition_plans
             WHERE user_id = ?
             ORDER BY id DESC
             LIMIT 1`,
            [req.user.id]
        );

        const byDate = new Map(
            rows.map(row => [
                row.date,
                {
                    date: row.date,
                    calories: Number(row.calories),
                    protein: Number(row.protein),
                    carbs: Number(row.carbs),
                    fat: Number(row.fat),
                    fiber: Number(row.fiber),
                    meal_count: Number(row.meal_count)
                }
            ])
        );

        const dailyData = [];
        for (
            let cursor = new Date(start);
            cursor <= end;
            cursor = addDays(cursor, 1)
        ) {
            const date = toDateString(cursor);
            const values = byDate.get(date) || {
                date,
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
                meal_count: 0
            };

            dailyData.push({
                ...values,
                label: cursor.toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: 'numeric'
                })
            });
        }

        let data = dailyData;

        if (period === 'yearly') {
            data = Array.from({ length: 12 }, (_, month) => {
                const monthRows = dailyData.filter(
                    item => Number(item.date.slice(5, 7)) === month + 1
                );
                return {
                    label: new Date(
                        start.getFullYear(),
                        month,
                        1
                    ).toLocaleDateString('en-US', { month: 'short' }),
                    date: `${start.getFullYear()}-${String(month + 1).padStart(2, '0')}`,
                    calories: monthRows.reduce((sum, item) => sum + item.calories, 0),
                    protein: monthRows.reduce((sum, item) => sum + item.protein, 0),
                    carbs: monthRows.reduce((sum, item) => sum + item.carbs, 0),
                    fat: monthRows.reduce((sum, item) => sum + item.fat, 0),
                    fiber: monthRows.reduce((sum, item) => sum + item.fiber, 0),
                    meal_count: monthRows.reduce((sum, item) => sum + item.meal_count, 0)
                };
            });
        }

        const summary = dailyData.reduce(
            (totals, item) => ({
                calories: totals.calories + item.calories,
                protein: totals.protein + item.protein,
                carbs: totals.carbs + item.carbs,
                fat: totals.fat + item.fat,
                fiber: totals.fiber + item.fiber,
                meal_count: totals.meal_count + item.meal_count
            }),
            {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
                meal_count: 0
            }
        );

        const missedDays = dailyData
            .filter(item => item.date < today && item.meal_count === 0)
            .slice(-7)
            .reverse()
            .map(item => ({
                date: item.date,
                message:
                    `You did not log any meals on ${new Date(
                        `${item.date}T12:00:00`
                    ).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                    })}. Would you like to add them now?`
            }));

        res.json({
            period,
            start_date: startDate,
            end_date: endDate,
            summary,
            goals: goalRows[0] || {},
            data,
            missed_days: missedDays
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Unable To Load Statistics'
        });
    }
};

module.exports = {
    getStatistics
};
