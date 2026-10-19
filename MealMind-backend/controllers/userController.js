const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const {
    saveNutritionPlan
} = require('../models/nutritionPlanModel');
const calculateNutrition =
require('../services/nutritionService');
require('dotenv').config({ quiet: true });

const {
findUserByEmail,
createUser,
getUserById,
updateUserById,
resetUserProfileById
} = require('../models/userModel');

const saveProfileImage = (
    imageData,
    userId
) => {

    if (!imageData) {
        return null;
    }

    if (
        typeof imageData !== 'string'
    ) {
        return null;
    }

    const match =
        imageData.match(
            /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/
        );

    if (!match) {
        return null;
    }

    const extension =
        match[1] === 'jpeg'
            ? 'jpg'
            : match[1];

    const uploadDir =
        path.join(
            __dirname,
            '..',
            'uploads',
            'profiles'
        );

    fs.mkdirSync(
        uploadDir,
        {
            recursive: true
        }
    );

    const fileName =
        `${userId}-${Date.now()}.${extension}`;

    fs.writeFileSync(
        path.join(uploadDir, fileName),
        Buffer.from(match[2], 'base64')
    );

    return `/uploads/profiles/${fileName}`;

};

const registerUser = async (req, res) => {


try {

    const userData = req.body;

    findUserByEmail(
        userData.email,
        async (err, results) => {

            if (err) {

                return res.status(500).json({
                    message: 'Database Error'
                });

            }

            if (results.length > 0) {

                return res.status(400).json({
                    message: 'Email already exists'
                });

            }

            const hashedPassword =
                await bcrypt.hash(
                    userData.password,
                    10
                );

            userData.password =
                hashedPassword;

            createUser(
                userData,
                (err) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            message:
                                'Registration Failed'
                        });

                    }

                    res.status(201).json({
                        message:
                            'User Registered Successfully'
                    });

                }
            );

        }
    );

}

catch (error) {

    console.log(error);

    res.status(500).json({
        message: 'Server Error'
    });

}


};

const loginUser = (req, res) => {


const {
    email,
    password
} = req.body;

findUserByEmail(
    email,
    async (err, results) => {

        if (err) {

            return res.status(500).json({
                message: 'Database Error'
            });

        }

        if (results.length === 0) {

            return res.status(400).json({
                message:
                    'Invalid Email or Password'
            });

        }

        const user =
            results[0];

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({
                message:
                    'Invalid Email or Password'
            });

        }

        const token = jwt.sign(

            {
                id: user.id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '7d'
            }

        );

        res.status(200).json({

            message:
                'Login Successful',

            token,

            user: {

                id: user.id,

                name: user.name,

                email: user.email

            }

        });

    }
);


};

const getProfile = (req, res) => {


const userId =
    req.user.id;

getUserById(
    userId,
    (err, results) => {

        if (err) {

            return res.status(500).json({
                message:
                    'Database Error'
            });

        }

        if (results.length === 0) {

            return res.status(404).json({
                message:
                    'User Not Found'
            });

        }

        res.status(200).json(
            results[0]
        );

    }
);


};

const updateProfile = (req, res) => {


const userId = req.user.id;

const profileImageUrl =
    saveProfileImage(
        req.body.profile_image_data,
        userId
    );

const profilePayload = {
    ...req.body,
    profile_image_url:
        profileImageUrl ||
        req.body.profile_image_url ||
        null
};

updateUserById(

    userId,

    profilePayload,

    (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: 'Profile Update Failed'
            });

        }

        try {

            const nutrition =
                calculateNutrition(
                    profilePayload
                );

                console.log(
    "Saving Nutrition:",
    nutrition
);
            saveNutritionPlan(

                userId,

                nutrition,

                (saveErr) => {

                    if (saveErr) {

                        console.log(saveErr);

                        return res.status(500).json({
                            message:
                                'Nutrition Plan Save Failed'
                        });

                    }

                    return res.status(200).json({

                        message:
                            'Profile Updated Successfully',

                        nutrition
,
                        profile_image_url:
                            profileImageUrl ||
                            req.body.profile_image_url ||
                            null

                    });

                }

            );

        }

        catch (error) {

            console.log(error);

            return res.status(500).json({

                message:
                    error.message

            });

        }

    }

);


};

const resetProfile = (req, res) => {

const userId =
    req.user.id;

resetUserProfileById(

    userId,

    (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: 'Profile Reset Failed'
            });

        }

        db.query(

            'DELETE FROM nutrition_plans WHERE user_id = ?',

            [userId],

            (planErr) => {

                if (planErr) {

                    console.log(planErr);

                    return res.status(500).json({
                        message: 'Nutrition Plan Reset Failed'
                    });

                }

                db.query(

                    'DELETE FROM nutrition_targets WHERE user_id = ?',

                    [userId],

                    (targetErr) => {

                        if (targetErr) {

                            console.log(targetErr);

                            return res.status(500).json({
                                message: 'Nutrition Target Reset Failed'
                            });

                        }

                        return res.status(200).json({
                            message: 'Profile Reset Successfully'
                        });

                    }

                );

            }

        );

    }

);

};


module.exports = {


registerUser,
loginUser,
getProfile,
updateProfile,
resetProfile
};
