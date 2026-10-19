import { useState } from "react";

import {
  useNavigate,
  Link
}
from "react-router-dom";

import {
  registerUser
}
from "../../api/authApi";

function Register() {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({

      name: "",

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

        await registerUser(
          form
        );

        alert(
          "Registration Successful"
        );

        navigate(
          "/login"
        );

      }

      catch {

        alert(
          "Registration Failed"
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
          width: "500px",
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

            Create Account 🚀

          </h3>

          <form
            onSubmit={handleSubmit}
          >

            <label className="fw-bold">

              Full Name

            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter Full Name"
              className="form-control mb-3"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label className="fw-bold">

              Email

            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="form-control mb-3"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label className="fw-bold">

              Password

            </label>

            <input
              type="password"
              name="password"
              placeholder="Create Password"
              className="form-control mb-4"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="btn btn-success w-100 py-2"
            >

              Register

            </button>

          </form>

          <div
            className="text-center mt-4"
          >

            Already have an account?

            {" "}

            <Link
              to="/login"
            >

              Login

            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Register;
