# MealMind backend

## Setup

1. Install Node.js and MySQL.
2. Create a MySQL database, then run `database/schema.sql` and the seed files in `database/`.
3. Copy `.env.example` to `.env` and set the database credentials, a long random `JWT_SECRET`, and a USDA FoodData Central API key.
4. Run `npm install`, then `npm run dev` for development or `npm start` for production.

The API listens on port `1403` by default. Set `PORT` to change it. Do not commit `.env`.
