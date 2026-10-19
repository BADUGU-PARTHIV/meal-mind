import { useEffect, useState } from "react";

import CaloriesChart from "../../components/charts/CaloriesChart";
import WeightChart from "../../components/charts/WeightChart";
import MacroChart from "../../components/charts/MacroChart";

import ProgressCard from "../../components/dashboard/ProgressCard";

import { getDashboard } from "../../api/dashboardApi";
import {
    resetTodayFoodLogs
} from "../../api/foodLogApi";

function Dashboard() {

    const [dashboard, setDashboard] =
    useState(null);

    const [loading, setLoading] =
    useState(true);
    const [errorMessage, setErrorMessage] =
    useState("");
    const [resetting, setResetting] =
    useState(false);
    const [refreshVersion, setRefreshVersion] =
    useState(0);

    async function loadDashboard() {

        try {

            setErrorMessage("");

            const response =
            await getDashboard();

            setDashboard(
                response.data
            );

        }

        catch (error) {

            console.log(error);

            setDashboard(null);

            setErrorMessage(
                error.response?.data?.message ||
                "Unable to load dashboard. Please make sure the backend server is running and try again."
            );

        }

        finally {

            setLoading(false);

        }

    }

    const safeDashboard =
        dashboard || {};

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDashboard();
    }, []);

    const handleResetToday = async () => {

        const shouldReset = window.confirm(
            "Reset all meals logged today? Today's calories and nutrients will return to zero."
        );

        if (!shouldReset) return;

        try {

            setResetting(true);

            await resetTodayFoodLogs();

            const now = new Date();
            const localDate = new Date(
                now.getTime() -
                now.getTimezoneOffset() * 60000
            )
                .toISOString()
                .split("T")[0];

            localStorage.removeItem(
                `mealmind_custom_meals_${localDate}`
            );

            await loadDashboard();
            setRefreshVersion(prev => prev + 1);

        }

        catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to reset today's meals."
            );

        }

        finally {
            setResetting(false);
        }

    };

    if (loading) {

        return (

            <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    height: "100vh"
                }}
            >

                <h2>

                    Loading Dashboard...

                </h2>

            </div>

        );

    }

    if (!dashboard) {

        return (

            <div className="container-fluid">

                <div className="alert alert-danger mt-4">

                    {errorMessage || "Unable to load dashboard."}

                </div>

                <button
                    className="btn btn-primary"
                    onClick={loadDashboard}
                >
                    Retry Dashboard
                </button>

            </div>

        );

    }

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="fw-bold mb-0">
                    Dashboard
                </h2>

                <button
                    className="btn btn-outline-danger"
                    onClick={handleResetToday}
                    disabled={resetting}
                >
                    {
                        resetting
                            ? "Resetting..."
                            : "Reset Today"
                    }
                </button>

            </div>

            <div className="row g-3">

                <div className="col-md-4">

                    <ProgressCard

                        title="Calories"

                        value={safeDashboard.totalCalories}

                        goal={safeDashboard.goalCalories}

                        progress={safeDashboard.calorieProgress}

                        unit="kcal"

                    />

                </div>

                <div className="col-md-4">

                    <ProgressCard

                        title="Protein"

                        value={safeDashboard.totalProtein}

                        goal={safeDashboard.goalProtein}

                        progress={safeDashboard.proteinProgress}

                        unit="g"

                    />

                </div>

                <div className="col-md-4">

                    <ProgressCard

                        title="Carbs"

                        value={safeDashboard.totalCarbs}

                        goal={safeDashboard.goalCarbs}

                        progress={safeDashboard.carbProgress}

                        unit="g"

                    />

                </div>

                <div className="col-md-4">

                    <ProgressCard

                        title="Fat"

                        value={safeDashboard.totalFat}

                        goal={safeDashboard.goalFat}

                        progress={safeDashboard.fatProgress}

                        unit="g"

                    />

                </div>

                <div className="col-md-4">

                    <ProgressCard

                        title="Fiber"

                        value={safeDashboard.totalFiber}

                        goal={safeDashboard.goalFiber}

                        progress={safeDashboard.fiberProgress}

                        unit="g"

                    />

                </div>

                <div className="col-md-4">

                    <ProgressCard

                        title="Water"

                        value={safeDashboard.waterIntake}

                        goal={safeDashboard.goalWater}

                        progress={safeDashboard.waterProgress}

                        unit="L"

                    />

                </div>

            </div>

            <div className="row mt-4">

                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-body text-center">

                            <h5>

                                Meals

                            </h5>

                            <h2>

                                {dashboard.mealCount}

                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-body text-center">

                            <h5>

                                Pantry Items

                            </h5>

                            <h2>

                                {dashboard.pantryCount}

                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-body text-center">

                            <h5>

                                Shopping Items

                            </h5>

                            <h2>

                                {dashboard.shoppingCount}

                            </h2>

                        </div>

                    </div>

                </div>

            </div>

            <div className="row mt-4">

                <div className="col-md-12">

                    <div className="card shadow border-0">

                        <div className="card-body text-center">

                            <h4>

                                Today's Health Score

                            </h4>

                            <h1 className="display-3 text-success">

                                {dashboard.healthScore}/100

                            </h1>

                        </div>

                    </div>

                </div>

            </div>
                        <div className="row mt-4">

                <div className="col-lg-6">

                    <div className="card shadow border-0 h-100">

                        <div className="card-body">

                            <h4 className="mb-3">

                                Weekly Calories

                            </h4>

                            <CaloriesChart
                                key={refreshVersion}
                            />

                        </div>

                    </div>

                </div>

                <div className="col-lg-6">

                    <div className="card shadow border-0 h-100">

                        <div className="card-body">

                            <h4 className="mb-3">

                                Weight Progress

                            </h4>

                            <WeightChart />

                        </div>

                    </div>

                </div>

            </div>

            <div className="row mt-4">

                <div className="col-lg-6">

                    <div className="card shadow border-0 h-100">

                        <div className="card-body">

                            <h4 className="mb-3">

                                Macro Split

                            </h4>

                            <MacroChart
                                key={refreshVersion}
                            />

                        </div>

                    </div>

                </div>

                <div className="col-lg-6">

                    <div className="card shadow border-0 h-100">

                        <div className="card-body">

                            <h4 className="mb-3">

                                🤖 Smart Insights

                            </h4>

                            {

                                dashboard.insights &&
                                dashboard.insights.length > 0

                                ?

                                <ul className="list-group list-group-flush">

                                    {

                                        dashboard.insights.map(

                                            (item, index) => (

                                                <li

                                                    key={index}

                                                    className="list-group-item"

                                                >

                                                    {item}

                                                </li>

                                            )

                                        )

                                    }

                                </ul>

                                :

                                <div className="alert alert-success">

                                    🎉 Excellent!

                                    All today's nutrition goals have been completed.

                                </div>

                            }

                        </div>

                    </div>

                </div>

            </div>

            <div className="row mt-4">

                <div className="col-md-12">

                    <div className="card shadow border-0">

                        <div className="card-body">

                            <h4 className="mb-4">

                                Today's Summary

                            </h4>

                            <div className="row text-center">

                                <div className="col-md-3">

                                    <h6>Calories</h6>

                                    <h3 className="text-success">

                                        {dashboard.totalCalories}

                                    </h3>

                                </div>

                                <div className="col-md-3">

                                    <h6>Protein</h6>

                                    <h3 className="text-primary">

                                        {dashboard.totalProtein} g

                                    </h3>

                                </div>

                                <div className="col-md-3">

                                    <h6>Water</h6>

                                    <h3 className="text-info">

                                        {dashboard.waterIntake} L

                                    </h3>

                                </div>

                                <div className="col-md-3">

                                    <h6>Health Score</h6>

                                    <h3 className="text-warning">

                                        {dashboard.healthScore}/100

                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;
