import {
BrowserRouter,
Routes,
Route,
Navigate,
useParams
} from "react-router-dom";

import {
lazy,
Suspense
} from "react";

import MainLayout from "../components/layout/MainLayout";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const DietPlan = lazy(() => import("../pages/nutrition/DietPlan"));
const MealPlanner = lazy(() => import("../pages/meals/MealPlanner"));
const Recipes = lazy(() => import("../pages/meals/Recipes"));
const RecipeDetails = lazy(() => import("../pages/meals/RecipeDetails"));
const Pantry = lazy(() => import("../pages/pantry/Pantry"));
const ShoppingList = lazy(() => import("../pages/shopping/ShoppingList"));
const WaterTracker = lazy(() => import("../pages/water/WaterTracker"));
const WeightTracker = lazy(() => import("../pages/weight/WeightTracker"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const FoodLogs = lazy(() => import("../pages/dashboard/FoodLogs"));
const Favorites = lazy(() => import("../pages/dashboard/Favorites"));
const Reports = lazy(() => import("../pages/reports/Reports"));
const Statistics = lazy(() => import("../pages/statistics/Statistics"));

const pageFallback = (
  <div className="container mt-5">
    <div className="alert alert-info">
      Loading...
    </div>
  </div>
);

function LegacyRecipeRedirect() {
  const { id } = useParams();

  return <Navigate to={`/recipe/${id}`} replace />;
}

function AppRoutes() {

return (

<BrowserRouter>

  <Suspense fallback={pageFallback}>

  <Routes>

    {/* Authentication */}

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    {/* Dashboard */}

    <Route
      path="/"
      element={
        <MainLayout>
          <Dashboard />
        </MainLayout>
      }
    />

    {/* Profile */}

    <Route
      path="/profile"
      element={
        <MainLayout>
          <Profile />
        </MainLayout>
      }
    />

    <Route
      path="/diet-plan"
      element={
      <MainLayout>
        <DietPlan />
      </MainLayout>
  }
    />

    {/* Meal Planner */}

    <Route
      path="/meals"
      element={
        <MainLayout>
          <MealPlanner />
        </MainLayout>
      }
    />

    <Route
      path="/recipes"
      element={
        <MainLayout>
          <Recipes />
        </MainLayout>
      }
    />

    {/* Recipe Details */}

    <Route
      path="/recipe/:id"
      element={
        <MainLayout>
          <RecipeDetails />
        </MainLayout>
      }
    />

    {/* Shopping List */}

    <Route
      path="/shopping"
      element={
        <MainLayout>
          <ShoppingList />
        </MainLayout>
      }
    />

    {/* Pantry */}

    <Route
      path="/pantry"
      element={
        <MainLayout>
          <Pantry />
        </MainLayout>
      }
    />

    {/* Water Tracker */}

    <Route
      path="/water"
      element={
        <MainLayout>
          <WaterTracker />
        </MainLayout>
      }
    />

    {/* Weight Tracker */}

    <Route
      path="/weight"
      element={
        <MainLayout>
          <WeightTracker />
        </MainLayout>
      }
    />

    {/* Food Logs */}

    <Route
      path="/foodlogs"
      element={
        <MainLayout>
          <FoodLogs />
        </MainLayout>
      }
    />

    {/* Favorites */}

    <Route
      path="/favorites"
      element={
        <MainLayout>
          <Favorites />
        </MainLayout>
      }
    />

    <Route
      path="/api/recipes/full/:id"
      element={<LegacyRecipeRedirect />}
    />

    <Route
      path="/reports"
      element={
        <MainLayout>
          <Reports />
        </MainLayout>
      }
    />

    <Route
      path="/statistics"
      element={
        <MainLayout>
          <Statistics />
        </MainLayout>
      }
    />

  </Routes>

  </Suspense>

</BrowserRouter>

);

}

export default AppRoutes;
