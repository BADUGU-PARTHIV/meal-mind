const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const db = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');
const pantryRoutes = require('./routes/pantryRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const waterRoutes = require('./routes/waterRoutes');
const weightRoutes = require('./routes/weightRoutes');
const usdaRoutes = require('./routes/usdaRoutes');
const mealDbRoutes = require('./routes/mealDbRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const inventoryAlertRoutes = require('./routes/inventoryAlertRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const nutritionPlanRoutes = require('./routes/nutritionPlanRoutes');
const customMealRoutes =require("./routes/customMealRoutes");
const nutritionTargetRoutes =require("./routes/nutritionTargetRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");
const app = express();

app.use(cors());
app.use(express.json({
    limit: '8mb'
}));
app.use(helmet());
app.use(
    '/uploads',
    express.static(
        path.join(__dirname, 'uploads')
    )
);

app.use('/api/users', userRoutes);

app.use('/api', foodRoutes);
app.use('/api', shoppingRoutes);
app.use('/api', pantryRoutes);
app.use('/api', ingredientRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', waterRoutes);
app.use('/api', weightRoutes);
app.use('/api', budgetRoutes);

app.use('/api/usda', usdaRoutes);
app.use('/api/meals', mealDbRoutes);

app.use('/api/mealplan', mealPlanRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/inventory-alerts', inventoryAlertRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api', favoriteRoutes);
app.use('/api/nutrition-plan', nutritionPlanRoutes);
app.use("/api", customMealRoutes);
app.use("/api/nutrition-target",nutritionTargetRoutes);
app.use("/api", statisticsRoutes);
app.get('/', (req, res) => {res.send('MealMind Backend Running');});

app.use(errorHandler);

const PORT = process.env.PORT || 1403;

const startServer = async () => {

    try {

        await db.connectDatabase();

        console.log('Database Connected');

        app.listen(PORT, () => {

            console.log(`Server Running On Port ${PORT}`);

        });

    }

    catch (error) {

        console.log(error);

    }

};

startServer();
