import { useEffect, useState } from "react";

import {
  getPantry,
  addPantry,
  adjustPantryQuantity,
  deletePantry
} from "../../api/pantryApi";

import LowStockAlert
from "../../components/pantry/LowStockAlert";

function Pantry() {

  const [items, setItems] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");
  const [updatingId, setUpdatingId] =
    useState(null);

  const [search,
    setSearch] =
    useState("");

  const [newItem,
    setNewItem] =
    useState({

      item_name: "",

      quantity: "",

      unit: "kg",

      low_stock_threshold: ""

    });

  async function loadPantry() {

      try {

        setError("");

        const response =
          await getPantry();

        setItems(
          response.data
        );

      }

      catch (error) {

        console.log(error);

        setError(
          error.response?.data?.message ||
          "Unable to load pantry items."
        );

      }

      finally {
        setLoading(false);
      }

    }

  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPantry();

  }, []);

  const handleAdd =
    async () => {

      try {

        const quantity = Number(newItem.quantity);
        const threshold = Number(
          newItem.low_stock_threshold
        );

        if (
          !newItem.item_name.trim() ||
          !Number.isFinite(quantity) ||
          quantity <= 0 ||
          !Number.isFinite(threshold) ||
          threshold < 0
        ) {
          setError(
            "Enter an item name, a quantity greater than zero, and a valid low-stock level."
          );
          return;
        }

        setError("");

        await addPantry({

          item_name:
            newItem.item_name,

          quantity:
            Number(
              newItem.quantity
            ),

          unit:
            newItem.unit,

          low_stock_threshold:
            Number(
              newItem.low_stock_threshold
            )

        });

        setNewItem({

          item_name: "",

          quantity: "",

          unit: "kg",

          low_stock_threshold: ""

        });

        loadPantry();

      }

      catch (error) {

        console.log(error);

        setError(
          error.response?.data?.message ||
          "Unable to add this pantry item."
        );

      }

    };

  const changeQuantity = async (
    item,
    direction
  ) => {

    const step =
      item.unit === "kg"
        ? 0.5
        : item.unit === "g"
          ? 50
          : 1;

    try {
      setUpdatingId(item.id);
      setError("");
      await adjustPantryQuantity(
        item.id,
        step * direction
      );
      await loadPantry();
    }
    catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
        "Unable to update the quantity."
      );
    }
    finally {
      setUpdatingId(null);
    }

  };

  const removeItem =
    async (id) => {

      if (
        !window.confirm(
          "Delete Item?"
        )
      ) {

        return;

      }

      try {
        setError("");
        await deletePantry(id);
        await loadPantry();
      }
      catch (error) {
        console.log(error);
        setError(
          error.response?.data?.message ||
          "Unable to delete this pantry item."
        );
      }

    };

  const filteredItems =
    items.filter(item =>
      item.item_name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-body">

          <h2 className="mb-3">
            Pantry
          </h2>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <LowStockAlert
            items={items}
          />

          <div className="row mb-4">

            <div className="col-md-3">

              <input
                className="form-control"
                placeholder="Item Name"
                value={
                  newItem.item_name
                }
                onChange={(e) =>
                  setNewItem({

                    ...newItem,

                    item_name:
                      e.target.value

                  })
                }
              />

            </div>

            <div className="col-md-2">

              <input
                type="number"
                min="0.01"
                step="any"
                className="form-control"
                placeholder="Quantity"
                value={
                  newItem.quantity
                }
                onChange={(e) =>
                  setNewItem({

                    ...newItem,

                    quantity:
                      e.target.value

                  })
                }
              />

            </div>

            <div className="col-md-2">

              <select
                className="form-select"
                value={
                  newItem.unit
                }
                onChange={(e) =>
                  setNewItem({

                    ...newItem,

                    unit:
                      e.target.value

                  })
                }
              >

                <option>
                  kg
                </option>

                <option>
                  pcs
                </option>

                <option>
                  g
                </option>

              </select>

            </div>

            <div className="col-md-2">

              <input
                type="number"
                min="0"
                step="any"
                className="form-control"
                placeholder="Low Stock"
                value={
                  newItem.low_stock_threshold
                }
                onChange={(e) =>
                  setNewItem({

                    ...newItem,

                    low_stock_threshold:
                      e.target.value

                  })
                }
              />

            </div>

            <div className="col-md-3">

              <button
                className="btn btn-success w-100"
                onClick={
                  handleAdd
                }
              >
                Add Item
              </button>

            </div>

          </div>

          <input
            className="form-control mb-3"
            placeholder="Search Pantry..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <div className="row">

  {

    loading ?

    <div className="col-12 text-center py-4">
      Loading pantry...
    </div>

    :

    filteredItems.length > 0 ?

    filteredItems.map(item => (

      <div
        className="col-md-4 mb-4"
        key={item.id}
      >

        <div className="card shadow h-100">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center">

              <h5>

                {item.item_name}

              </h5>

              {

                Number(item.quantity)
                <=
                Number(item.low_stock_threshold)

                ?

                <span className="badge bg-danger">

                  Low Stock

                </span>

                :

                <span className="badge bg-success">

                  In Stock

                </span>

              }

            </div>

            <hr />

            <p>

              <strong>Quantity:</strong>

              {" "}

              {item.quantity}
              {" "}
              {item.unit}

            </p>

            <p>

              <strong>Added:</strong>

              {" "}

              {

                new Date(
                  item.created_at
                ).toLocaleDateString()

              }

            </p>

            <div className="mb-3">

              <button
                className="btn btn-warning me-2"
                onClick={() =>
                  changeQuantity(item, -1)
                }
                disabled={updatingId === item.id}
              >

                -

              </button>

              <button
                className="btn btn-success me-2"
                onClick={() =>
                  changeQuantity(item, 1)
                }
                disabled={updatingId === item.id}
              >

                +

              </button>

              <button
                className="btn btn-danger"
                onClick={() =>
                  removeItem(item.id)
                }
                disabled={updatingId === item.id}
              >

                Delete

              </button>

            </div>

          </div>

        </div>

      </div>

    ))

    :

    <div className="col-12">

      <div className="alert alert-info">

        No Pantry Items Found

      </div>

    </div>

  }

</div>

        </div>

      </div>

    </div>

  );

}

export default Pantry;
