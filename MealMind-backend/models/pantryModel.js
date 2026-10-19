const db = require('../config/db');

const addPantryItem = (itemData, callback) => {

    const sql = `
        INSERT INTO pantry_items
        (
            user_id,
            item_name,
            quantity,
            unit,
            low_stock_threshold
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        itemData.user_id,
        itemData.item_name,
        itemData.quantity,
        itemData.unit,
        itemData.low_stock_threshold
    ], callback);

};
const getPantryItemsByUserId = (userId, callback) => {

    const sql = `
        SELECT * FROM pantry_items
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], callback);

};
const updatePantryItemById = (id, userId, itemData, callback) => {

    const sql = `
        UPDATE pantry_items
        SET
            item_name = ?,
            quantity = ?,
            unit = ?,
            low_stock_threshold = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [
        itemData.item_name,
        itemData.quantity,
        itemData.unit,
        itemData.low_stock_threshold,
        id,
        userId
    ], callback);

};

const adjustPantryQuantityById = (
    id,
    userId,
    delta,
    callback
) => {

    const sql = `
        UPDATE pantry_items
        SET quantity = GREATEST(0, quantity + ?)
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [delta, id, userId], callback);

};

const deletePantryItemById = (id, userId, callback) => {

    const sql = `
        DELETE FROM pantry_items
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [id, userId], callback);

};

const getLowStockItems = (userId, callback) => {

    const sql = `
        SELECT *
        FROM pantry_items
        WHERE user_id = ?
        AND quantity <= low_stock_threshold
    `;

    db.query(sql, [userId], callback);

};
const reducePantryQuantity = (
    userId,
    itemName,
    quantity,
    callback
) => {

    const sql = `
        UPDATE pantry_items
        SET quantity = GREATEST(0, quantity - ?)
        WHERE user_id = ?
        AND LOWER(TRIM(item_name)) = LOWER(TRIM(?))
    `;

    db.query(
        sql,
        [quantity, userId, itemName],
        callback
    );

};
const increasePantryQuantity = (
    userId,
    itemName,
    quantity,
    callback
) => {

    const sql = `
        UPDATE pantry_items
        SET quantity = quantity + ?
        WHERE user_id = ?
        AND LOWER(TRIM(item_name)) = LOWER(TRIM(?))
    `;

    db.query(
        sql,
        [quantity, userId, itemName],
        callback
    );

};
module.exports = {
    addPantryItem,
    getPantryItemsByUserId,
    updatePantryItemById,
    adjustPantryQuantityById,
    deletePantryItemById,
    getLowStockItems,
    reducePantryQuantity,
    increasePantryQuantity
};
