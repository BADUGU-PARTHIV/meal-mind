const {
    generateMonthlyShoppingList
} = require(
    '../services/monthlyShoppingListService'
);

const createMonthlyShoppingList = (
    req,
    res
) => {

    const userId =
        req.user.id;

    generateMonthlyShoppingList(
        userId,
        (err, result) => {

            if (err) {

                return res
                    .status(500)
                    .json({
                        message:
                        'Failed to Generate Shopping List'
                    });

            }

            res.status(200).json({
                message:
                'Shopping List Generated Successfully',
                shoppingList:
                result
            });

        }
    );

};

module.exports = {
    createMonthlyShoppingList
};