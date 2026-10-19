import { useEffect, useState } from "react";

import {
  getWeights,
  addWeight
}
from "../../api/weightApi";

function WeightTracker() {

  const [weight,
    setWeight] =
    useState("");

  const [history,
    setHistory] =
    useState([]);

  useEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    loadWeights();

  }, []);

  const loadWeights =
    async () => {

      try {

        const response =
          await getWeights();

        setHistory(
          response.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  const saveWeight =
    async () => {

      if (!weight)
        return;

      try {

        await addWeight({

          weight

        });

        setWeight("");

        loadWeights();

      }

      catch (error) {

        console.log(error);

      }

    };

  const currentWeight =
    history.length > 0
      ? history[0].weight
      : 0;

  const firstWeight =
    history.length > 0
      ? history[
          history.length - 1
        ].weight
      : 0;

  const difference =
    currentWeight -
    firstWeight;

  return (

    <div className="container mt-4">

      <div className="card shadow mb-4">

        <div className="card-body">

          <h2>
            Weight Tracker
          </h2>

          <div className="row">

            <div className="col-md-8">

              <input
                type="number"
                className="form-control"
                placeholder="Enter Weight"
                value={weight}
                onChange={(e) =>
                  setWeight(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-md-4">

              <button
                className="btn btn-success w-100"
                onClick={
                  saveWeight
                }
              >

                Save Weight

              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="row mb-4">

        <div className="col">

          <div className="card text-center">

            <div className="card-body">

              <h6>
                Current Weight
              </h6>

              <h4>
                {currentWeight} kg
              </h4>

            </div>

          </div>

        </div>

        <div className="col">

          <div className="card text-center">

            <div className="card-body">

              <h6>
                Starting Weight
              </h6>

              <h4>
                {firstWeight} kg
              </h4>

            </div>

          </div>

        </div>

        <div className="col">

          <div className="card text-center">

            <div className="card-body">

              <h6>
                Progress
              </h6>

              <h4>

                {difference > 0
                  ? `+${difference}`
                  : difference}

                kg

              </h4>

            </div>

          </div>

        </div>

      </div>

      <div className="card shadow">

        <div className="card-body">

          <h3>
            Weight History
          </h3>

          {

            history.length > 0 ?

            history.map(
              item => (

                <div
                  key={item.id}
                  className="border-bottom py-2"
                >

                  <strong>

                    {item.weight} kg

                  </strong>

                  {" - "}

                  {new Date(
                    item.created_at
                  ).toLocaleDateString()}

                </div>

              )
            )

            :

            <p>
              No Weight Logs Found
            </p>

          }

        </div>

      </div>

    </div>

  );

}

export default WeightTracker;
