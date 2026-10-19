import { useState } from "react";

import { useNavigate, Link }
from "react-router-dom";

import { loginUser }
from "../../api/authApi";

function Login() {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({

      email: "",

      password: ""

    });

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
        e.target.value

      });

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const response =
          await loginUser(form);

        localStorage.setItem(

          "token",

          response.data.token

        );

        navigate("/");

      }

      catch {

        alert(
          "Invalid Email or Password"
        );

      }

    };

  return (

    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
        "linear-gradient(135deg,#166534,#22c55e)"
      }}
    >

      <div
        className="card shadow border-0"
        style={{
          width: "450px",
          borderRadius: "25px"
        }}
      >

        <div className="card-body p-5">

          <div className="text-center mb-4">

            <h1>

              🍽 MealMind

            </h1>

            <p className="text-muted">

              Smart Nutrition Platform

            </p>

          </div>

          <h3
            className="text-center mb-4"
          >

            Welcome Back 👋

          </h3>

          <form
            onSubmit={handleSubmit}
          >

            <label className="fw-bold">

              Email

            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="form-control mb-3"
              onChange={handleChange}
            />

            <label className="fw-bold">

              Password

            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="form-control mb-4"
              onChange={handleChange}
            />

            <button
              className="btn btn-success w-100 py-2"
            >

              Login

            </button>

          </form>

          <div
            className="text-center mt-4"
          >

            Don't have an account?

            {" "}

            <Link
              to="/register"
            >

              Register

            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Login;
