ALTER TABLE food_logs
    ADD COLUMN recipe_id INT NULL AFTER user_id,
    ADD INDEX idx_food_logs_recipe_id (recipe_id);
