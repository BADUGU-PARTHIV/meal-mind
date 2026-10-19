function RecipeNutrition({ nutrition }) {

    if (!nutrition) {

        return null;

    }

    return (

        <div className="card shadow border-0">

            <div className="card-body">

                <h4 className="fw-bold mb-4">

                    Nutrition Facts

                </h4>

                <table className="table table-bordered align-middle">

                    <tbody>

                        <tr>
                            <th>🔥 Calories</th>
                            <td>{nutrition.calories} kcal</td>
                        </tr>

                        <tr>
                            <th>💪 Protein</th>
                            <td>{nutrition.protein} g</td>
                        </tr>

                        <tr>
                            <th>🍚 Carbohydrates</th>
                            <td>{nutrition.carbs} g</td>
                        </tr>

                        <tr>
                            <th>🥑 Fat</th>
                            <td>{nutrition.fat} g</td>
                        </tr>

                        <tr>
                            <th>🌾 Fiber</th>
                            <td>{nutrition.fiber} g</td>
                        </tr>

                    </tbody>

                </table>

                <hr />

                <h5 className="fw-bold mb-3">

                    Vitamins

                </h5>

                <table className="table table-bordered">

                    <tbody>

                        <tr>
                            <th>Vitamin A</th>
                            <td>{nutrition.vitamin_a}</td>
                        </tr>

                        <tr>
                            <th>Vitamin C</th>
                            <td>{nutrition.vitamin_c}</td>
                        </tr>

                        <tr>
                            <th>Vitamin D</th>
                            <td>{nutrition.vitamin_d}</td>
                        </tr>

                        <tr>
                            <th>Vitamin B12</th>
                            <td>{nutrition.vitamin_b12}</td>
                        </tr>

                    </tbody>

                </table>

                <hr />

                <h5 className="fw-bold mb-3">

                    Minerals

                </h5>

                <table className="table table-bordered">

                    <tbody>

                        <tr>
                            <th>Calcium</th>
                            <td>{nutrition.calcium} mg</td>
                        </tr>

                        <tr>
                            <th>Iron</th>
                            <td>{nutrition.iron} mg</td>
                        </tr>

                        <tr>
                            <th>Magnesium</th>
                            <td>{nutrition.magnesium} mg</td>
                        </tr>

                        <tr>
                            <th>Potassium</th>
                            <td>{nutrition.potassium} mg</td>
                        </tr>

                        <tr>
                            <th>Zinc</th>
                            <td>{nutrition.zinc} mg</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default RecipeNutrition;