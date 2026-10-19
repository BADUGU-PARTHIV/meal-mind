const db = require('../config/db');

const {
    buildDashboard
} = require('../services/dashboardService');

const getDashboardSummary =
async (req, res) => {

    try {

        const dashboard =
        await buildDashboard(
            req.user.id
        );

        res.status(200).json(
            dashboard
        );

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message:
            'Database Error'

        });

    }

};

const getWeeklyCalories =
(req, res) => {

    const userId =
    req.user.id;

    const sql = `
        SELECT
            DATE_FORMAT(consumed_date, '%Y-%m-%d') AS date,
            SUM(calories) AS calories
        FROM food_logs
        WHERE user_id = ?
        AND consumed_date >=
            DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(consumed_date)
        ORDER BY DATE(consumed_date)
    `;

    db.query(

        sql,

        [userId],

        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    message:
                    'Database Error'

                });

            }

            const caloriesByDate = new Map(
                results.map(item => [
                    item.date,
                    Number(item.calories)
                ])
            );
            const formatted = [];

            for (let offset = 6; offset >= 0; offset--) {
                const date = new Date();
                date.setDate(date.getDate() - offset);
                const dateKey = [
                    date.getFullYear(),
                    String(date.getMonth() + 1).padStart(2, '0'),
                    String(date.getDate()).padStart(2, '0')
                ].join('-');

                formatted.push({
                    day: date.toLocaleDateString(
                        'en-US',
                        { weekday: 'short' }
                    ),
                    date: dateKey,
                    calories: caloriesByDate.get(dateKey) || 0
                });
            }

            db.query(
                `SELECT calories
                 FROM nutrition_plans
                 WHERE user_id = ?
                 ORDER BY id DESC
                 LIMIT 1`,
                [userId],
                (goalErr, goalResults) => {

                    if (goalErr) {
                        return res.status(500).json({
                            message: 'Database Error'
                        });
                    }

                    res.json({
                        data: formatted,
                        goal: Number(
                            goalResults[0]?.calories || 0
                        )
                    });

                }
            );

        }

    );

};

module.exports = {
    getDashboardSummary,
    getWeeklyCalories

};
