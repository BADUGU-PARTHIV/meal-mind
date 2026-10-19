const pantryModel =
require('../models/pantryModel');

const getInventoryAlerts = (
    userId,
    callback
) => {

    pantryModel.getLowStockItems(
        userId,
        (err, results) => {

            if (err) {
                return callback(err);
            }

            const alerts =
                results.map(item => ({

                    item_name:
                        item.item_name,

                    quantity:
                        item.quantity,

                    threshold:
                        item.low_stock_threshold,

                    message:
                        `${item.item_name} is running low`

                }));

            callback(
                null,
                alerts
            );

        }
    );

};

module.exports = {
    getInventoryAlerts
};