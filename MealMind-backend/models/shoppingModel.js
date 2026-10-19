const db = require('../config/db');

const addShoppingItem = (itemData, callback) => {

    const sql = `
        INSERT INTO shopping_lists
        (
            user_id,
            item_name,
            quantity,
            unit,
            status
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        itemData.user_id,
        itemData.item_name,
        itemData.quantity,
        itemData.unit,
        itemData.status
    ], callback);

};
const getShoppingItemsByUserId = (userId, callback) => {

    const sql = `
        SELECT * FROM shopping_lists
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], callback);

};

const updateShoppingItemById = (
    id,
    userId,
    data,
    callback
) => {

    const sql = `
        UPDATE shopping_lists
        SET
            quantity = ?,
            status = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(

        sql,

        [

            Number(data.quantity),

            data.status || 'Pending',

            id,

            userId

        ],

        callback

    );

};

const deleteShoppingItemById = (id, userId, callback) => {

    const sql = `
        DELETE FROM shopping_lists
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [id, userId], callback);

};
module.exports = {
    addShoppingItem,
    getShoppingItemsByUserId,
    updateShoppingItemById,
    deleteShoppingItemById
};