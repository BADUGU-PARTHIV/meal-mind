const {
    generateRecommendation
} = require('../services/recommendationService');

const generatePlan = (req, res) => {

    try {

        const result =
            generateRecommendation(req.body);

        res.status(200).json(result);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Recommendation Failed'
        });

    }

};

module.exports = {
    generatePlan
};