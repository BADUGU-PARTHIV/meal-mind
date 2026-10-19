const db = require('../config/db');

const findUserByEmail = (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
};
const getUserById = (id, callback) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], callback);
};
const createUser = (userData, callback) => {
    const sql = `
        INSERT INTO users
        (
            name,
            email,
            password,
            age,
            gender,
            height,
            weight,
            body_fat_percentage,
            goal_body_fat_percentage,
            goal,
            diet_type,
            gym_status,
            activity_level,
            target_weight,
            allergy,
            deficiency
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    db.query(sql, [
        userData.name,
        userData.email,
        userData.password,
        userData.age,
        userData.gender,
        userData.height,
        userData.weight,
        userData.body_fat_percentage,
        userData.goal_body_fat_percentage,
        userData.goal,
        userData.diet_type,
        userData.gym_status,
        userData.activity_level,
        userData.target_weight,
        userData.allergy,
        userData.deficiency
    ], callback);
};
const updateUserById = (id, userData, callback) => {

    const sql = `
        UPDATE users
        SET
            age = ?,
            gender = ?,
            height = ?,
            weight = ?,
            body_fat_percentage = ?,
             goal_body_fat_percentage = ?,
            goal = ?,
            diet_type = ?,
            gym_status = ?,
            activity_level = ?,
            target_weight = ?,
            allergy = ?,
            deficiency = ?,
            meals_per_day = ?,
            profile_image_url = COALESCE(?, profile_image_url)
        WHERE id = ?
    `;

    db.query(sql, [
        userData.age,
        userData.gender,
        userData.height,
        userData.weight,
        userData.body_fat_percentage,
         userData.goal_body_fat_percentage,
        userData.goal,
        userData.diet_type,
        userData.gym_status,
        userData.activity_level,
        userData.target_weight,
        userData.allergy,
        userData.deficiency,
        userData.meals_per_day,
        userData.profile_image_url || null,
        id
    ], callback);

};

const resetUserProfileById = (id, callback) => {

    const sql = `
        UPDATE users
        SET
            age = 0,
            gender = NULL,
            height = 0,
            weight = 0,
            body_fat_percentage = 0,
            goal_body_fat_percentage = 0,
            goal = NULL,
            diet_type = NULL,
            gym_status = NULL,
            activity_level = NULL,
            target_weight = 0,
            allergy = NULL,
            deficiency = NULL,
            meals_per_day = 0,
            profile_image_url = NULL
        WHERE id = ?
    `;

    db.query(
        sql,
        [id],
        callback
    );

};

module.exports = {
    findUserByEmail,
    getUserById,
    createUser,
    updateUserById,
    resetUserProfileById
};
