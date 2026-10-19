import { useEffect, useState } from "react";

import { getDashboard }
from "../../api/dashboardApi";

import {
  getWeights
}
from "../../api/weightApi";

function Reports() {

  const [dashboard,
    setDashboard] =
    useState({});

  const [weights,
    setWeights] =
    useState([]);

  useEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    loadData();

  }, []);

  const loadData =
    async () => {

      try {

        const dashboardResponse =
          await getDashboard();

        const weightResponse =
          await getWeights();

        setDashboard(
          dashboardResponse.data
        );

        setWeights(
          weightResponse.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  const currentWeight =
    weights.length > 0
      ? weights[0].weight
      : 0;

  const startingWeight =
    weights.length > 0
      ? weights[
          weights.length - 1
        ].weight
      : 0;

  const progress =
    currentWeight -
    startingWeight;

  return (

    <div className="container mt-4">

      <h2 className="mb-4">

        Analytics & Reports

      </h2>

      <div className="row mb-4">

        <div className="col-md-3">

          <div className="card shadow">

            <div className="card-body text-center">

              <h6>
                Calories
              </h6>

              <h3>
                {
                  dashboard.totalCalories || 0
                }
              </h3>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card shadow">

            <div className="card-body text-center">

              <h6>
                Protein
              </h6>

              <h3>
                {
                  dashboard.totalProtein || 0
                }g
              </h3>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card shadow">

            <div className="card-body text-center">

              <h6>
                Carbs
              </h6>

              <h3>
                {
                  dashboard.totalCarbs || 0
                }g
              </h3>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card shadow">

            <div className="card-body text-center">

              <h6>
                Fat
              </h6>

              <h3>
                {
                  dashboard.totalFat || 0
                }g
              </h3>

            </div>

          </div>

        </div>

      </div>

      <div className="card shadow mb-4">

        <div className="card-body">

          <h4>
            Weight Progress
          </h4>

          <p>

            Starting Weight:
            {" "}
            {startingWeight}
            kg

          </p>

          <p>

            Current Weight:
            {" "}
            {currentWeight}
            kg

          </p>

          <p>

            Progress:
            {" "}

            {
              progress > 0
              ? `+${progress}`
              : progress
            }

            kg

          </p>

        </div>

      </div>

      <div className="card shadow">

        <div className="card-body">

          <h4>
            Report Summary
          </h4>

          <ul>

            <li>

              Total Calories:
              {" "}
              {
                dashboard.totalCalories || 0
              }

            </li>

            <li>

              Total Protein:
              {" "}
              {
                dashboard.totalProtein || 0
              }g

            </li>

            <li>

              Total Carbs:
              {" "}
              {
                dashboard.totalCarbs || 0
              }g

            </li>

            <li>

              Total Fat:
              {" "}
              {
                dashboard.totalFat || 0
              }g

            </li>

          </ul>

        </div>

      </div>

    </div>

  );

}

export default Reports;
