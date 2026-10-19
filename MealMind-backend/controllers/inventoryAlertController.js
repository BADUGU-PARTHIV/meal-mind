const {
    getInventoryAlerts
} = require(
    '../services/inventoryAlertService'
);

const getAlerts = (
    req,
    res
) => {

    const userId =
        req.user.id;

    getInventoryAlerts(
        userId,
        (err, alerts) => {

            if (err) {

                return res
                    .status(500)
                    .json({
                        message:
                        'Failed to Fetch Alerts'
                    });

            }

            res.status(200).json(
                alerts
            );

        }
    );

};

module.exports = {
    getAlerts
};