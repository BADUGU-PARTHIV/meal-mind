const recipes = [
    {
        id: '53049',
        name: 'Oats with Banana',
        category: 'Breakfast',
        area: 'International',
        ingredients: [
            { name: 'Rolled oats', measure: '1/2 cup' },
            { name: 'Milk', measure: '1 cup' },
            { name: 'Banana', measure: '1 sliced' },
            { name: 'Cinnamon', measure: '1/4 teaspoon' }
        ],
        instructions: 'Cook the oats with milk until creamy. Top with sliced banana and cinnamon, then serve warm.',
        nutrition: { calories: 360, protein: 13, carbs: 66, fat: 7, fiber: 8 }
    },
    {
        id: '52994',
        name: 'Vegetable Omelette',
        category: 'Breakfast',
        area: 'International',
        ingredients: [
            { name: 'Eggs', measure: '2' },
            { name: 'Bell pepper', measure: '1/4 cup chopped' },
            { name: 'Onion', measure: '1/4 cup chopped' },
            { name: 'Spinach', measure: '1/2 cup' }
        ],
        instructions: 'Whisk the eggs. Saute the vegetables, pour in the eggs, and cook until set. Fold and serve.',
        nutrition: { calories: 260, protein: 18, carbs: 10, fat: 17, fiber: 3 }
    },
    {
        id: '52795',
        name: 'Chicken Rice Bowl',
        category: 'Main',
        area: 'International',
        ingredients: [
            { name: 'Chicken breast', measure: '150 g' },
            { name: 'Cooked rice', measure: '1 cup' },
            { name: 'Mixed vegetables', measure: '1 cup' },
            { name: 'Olive oil', measure: '1 teaspoon' }
        ],
        instructions: 'Season and cook the chicken thoroughly. Serve over rice with sauteed mixed vegetables.',
        nutrition: { calories: 560, protein: 46, carbs: 62, fat: 13, fiber: 6 }
    },
    {
        id: '52855',
        name: 'Peanut Butter Sandwich',
        category: 'Snack',
        area: 'International',
        ingredients: [
            { name: 'Whole-grain bread', measure: '2 slices' },
            { name: 'Peanut butter', measure: '2 tablespoons' },
            { name: 'Banana', measure: '1/2 sliced' }
        ],
        instructions: 'Spread peanut butter on the bread, add banana slices, close the sandwich, and serve.',
        nutrition: { calories: 390, protein: 14, carbs: 49, fat: 17, fiber: 7 }
    },
    {
        id: '52818',
        name: 'Grilled Chicken',
        category: 'Main',
        area: 'International',
        ingredients: [
            { name: 'Chicken breast', measure: '180 g' },
            { name: 'Olive oil', measure: '1 teaspoon' },
            { name: 'Lemon juice', measure: '1 tablespoon' },
            { name: 'Black pepper', measure: 'To taste' }
        ],
        instructions: 'Marinate the chicken with oil, lemon, and pepper. Grill until fully cooked, then rest before slicing.',
        nutrition: { calories: 340, protein: 55, carbs: 2, fat: 11, fiber: 0 }
    }
];

const getCatalogRecipeById = (id) =>
    recipes.find((recipe) => recipe.id === String(id));

module.exports = {
    recipes,
    getCatalogRecipeById
};
