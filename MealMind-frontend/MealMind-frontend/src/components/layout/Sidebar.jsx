import {
  FaHome,
  FaUtensils,
  FaBookOpen,
  FaShoppingCart,
  FaBoxOpen,
  FaTint,
  FaWeight,
  FaHeart,
  FaChartBar,
  FaChartLine
}
from "react-icons/fa";

import {
  NavLink
}
from "react-router-dom";

import "../../styles/sidebar.css";

function Sidebar() {

  return (

    <div className="sidebar">

      <div className="logo-section">

        <h2>

          🍽 MealMind

        </h2>

        <p>

          Smart Nutrition Platform

        </p>

      </div>

      <nav>

        <NavLink to="/">
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/meals">
          <FaUtensils />
          Meal Planner
        </NavLink>

        <NavLink to="/recipes">
          <FaBookOpen />
          Recipes
        </NavLink>

        <NavLink to="/shopping">
          <FaShoppingCart />
          Shopping List
        </NavLink>

        <NavLink to="/pantry">
          <FaBoxOpen />
          Pantry
        </NavLink>

        <NavLink to="/water">
          <FaTint />
          Water Tracker
        </NavLink>

        <NavLink to="/weight">
          <FaWeight />
          Weight Tracker
        </NavLink>

        <NavLink to="/favorites">
          <FaHeart />
          Favorites
        </NavLink>

        <NavLink to="/reports">
          <FaChartBar />
          Reports
        </NavLink>

        <NavLink to="/statistics">
          <FaChartLine />
          Statistics
        </NavLink>

      </nav>

    </div>

  );

}

export default Sidebar;
