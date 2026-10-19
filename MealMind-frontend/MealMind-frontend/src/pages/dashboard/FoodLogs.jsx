import { useEffect, useState } from "react";

import {
  getFoodLogs,
  addFoodLog,
  deleteFoodLog
}
from "../../api/foodLogApi";

function FoodLogs() {

  const [logs, setLogs] =
    useState([]);

  const [food, setFood] =
    useState({

      food_name: "",

      quantity: "",

      calories: "",

      protein: "",

      carbs: "",

      fat: "",

      fiber: "",

      consumed_date:
        new Date()
          .toISOString()
          .split("T")[0]

    });

  useEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    loadLogs();

  }, []);

  const loadLogs =
    async () => {

      try {

        const response =
          await getFoodLogs();

        setLogs(
          response.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  const handleChange =
    (e) => {

      setFood({

        ...food,

        [e.target.name]:
          e.target.value

      });

    };

  const handleAdd =
    async () => {

      try {

        await addFoodLog(food);

        setFood({

          food_name: "",

          quantity: "",

          calories: "",

          protein: "",

          carbs: "",

          fat: "",

          fiber: "",

          consumed_date:
            new Date()
              .toISOString()
              .split("T")[0]

        });

        loadLogs();

      }

      catch (error) {

        console.log(error);

      }

    };

  const handleDelete =
    async (id) => {

      try {

        await deleteFoodLog(id);

        loadLogs();

      }

      catch (error) {

        console.log(error);

      }

    };

  const totals =
    logs.reduce(

      (acc, item) => {

        acc.calories +=
          Number(item.calories || 0);

        acc.protein +=
          Number(item.protein || 0);

        acc.carbs +=
          Number(item.carbs || 0);

        acc.fat +=
          Number(item.fat || 0);

        return acc;

      },

      {

        calories: 0,

        protein: 0,

        carbs: 0,

        fat: 0

      }

    );

  return (

    <div className="container mt-4">

      <div className="card shadow mb-4">

        <div className="card-body">

          <h2>
            Add Food Log
          </h2>

          <div className="row g-2">

            <div className="col-md-2">

              <input
                className="form-control"
                placeholder="Food Name"
                name="food_name"
                value={food.food_name}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-1">

              <input
                type="number"
                className="form-control"
                placeholder="Qty"
                name="quantity"
                value={food.quantity}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-1">

              <input
                type="number"
                className="form-control"
                placeholder="Calories"
                name="calories"
                value={food.calories}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-1">

              <input
                type="number"
                className="form-control"
                placeholder="Protein"
                name="protein"
                value={food.protein}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-1">

              <input
                type="number"
                className="form-control"
                placeholder="Carbs"
                name="carbs"
                value={food.carbs}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-1">

              <input
                type="number"
                className="form-control"
                placeholder="Fat"
                name="fat"
                value={food.fat}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-1">

              <input
                type="number"
                className="form-control"
                placeholder="Fiber"
                name="fiber"
                value={food.fiber}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-2">

              <input
                type="date"
                className="form-control"
                name="consumed_date"
                value={food.consumed_date}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-2">

              <button
                className="btn btn-success w-100"
                onClick={handleAdd}
              >

                Add Food

              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="row mb-4">

        <div className="col">

          <div className="card text-center">

            <div className="card-body">

              <h6>Calories</h6>

              <h4>
                {totals.calories}
              </h4>

            </div>

          </div>

        </div>

        <div className="col">

          <div className="card text-center">

            <div className="card-body">

              <h6>Protein</h6>

              <h4>
                {totals.protein}g
              </h4>

            </div>

          </div>

        </div>

        <div className="col">

          <div className="card text-center">

            <div className="card-body">

              <h6>Carbs</h6>

              <h4>
                {totals.carbs}g
              </h4>

            </div>

          </div>

        </div>

        <div className="col">

          <div className="card text-center">

            <div className="card-body">

              <h6>Fat</h6>

              <h4>
                {totals.fat}g
              </h4>

            </div>

          </div>

        </div>

      </div>

      <div className="card shadow">

        <div className="card-body">

          <h2>
            Food Logs
          </h2>

          <table className="table table-striped">

            <thead>

              <tr>

                <th>Food</th>

                <th>Quantity</th>

                <th>Calories</th>

                <th>Protein</th>

                <th>Carbs</th>

                <th>Fat</th>

                <th>Fiber</th>

                <th>Date</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {

                logs.length > 0 ?

                logs.map(log => (

                  <tr key={log.id}>

                    <td>{log.food_name}</td>

                    <td>{log.quantity}</td>

                    <td>{log.calories}</td>

                    <td>{log.protein}</td>

                    <td>{log.carbs}</td>

                    <td>{log.fat}</td>

                    <td>{log.fiber}</td>

                    <td>{log.consumed_date}</td>

                    <td>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDelete(log.id)
                        }
                      >

                        Delete

                      </button>

                    </td>

                  </tr>

                ))

                :

                <tr>

                  <td
                    colSpan="9"
                    className="text-center"
                  >

                    No Food Logs Found

                  </td>

                </tr>

              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default FoodLogs;
