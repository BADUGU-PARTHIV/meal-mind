import { useEffect, useState } from "react";

import {
  getWater,
  addWater
}
from "../../api/waterApi";

function WaterTracker() {

  const DAILY_GOAL = 3000;

  const [water, setWater] =
    useState(0);

  useEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    loadWater();

  }, []);

  const loadWater =
    async () => {

      try {

        const response =
          await getWater();

        setWater(
          response.data.amount || 0
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  const updateWater =
    async (amount) => {

      try {

        await addWater(amount);

        loadWater();

      }

      catch (error) {

        console.log(error);

      }

    };

  const percentage =
    Math.min(
      (water / DAILY_GOAL) * 100,
      100
    );

  return (

    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-body text-center">

          <h2 className="mb-4">

            💧 Water Tracker

          </h2>

          <h1 className="display-4">

            {water} ml

          </h1>

          <p>

            Goal:
            {" "}
            {DAILY_GOAL}
            ml

          </p>

          <div
            className="progress mb-4"
            style={{
              height: "30px"
            }}
          >

            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width:
                  `${percentage}%`
              }}
            >

              {Math.round(
                percentage
              )}
              %

            </div>

          </div>

          <button
            className="btn btn-primary me-2"
            onClick={() =>
              updateWater(250)
            }
          >

            +250ml

          </button>

          <button
            className="btn btn-success me-2"
            onClick={() =>
              updateWater(500)
            }
          >

            +500ml

          </button>

          <button
            className="btn btn-info me-2"
            onClick={() =>
              updateWater(750)
            }
          >

            +750ml

          </button>

          <button
            className="btn btn-warning"
            onClick={() =>
              updateWater(1000)
            }
          >

            +1L

          </button>

        </div>

      </div>

    </div>

  );

}

export default WaterTracker;
