import { useEffect, useState } from "react";

import {
  getShopping,
  addShopping,
  updateShopping,
  deleteShopping
}
from "../../api/shoppingApi";

import {
  transferToPantry
}
from "../../api/pantryTransferApi";

import PantryUpdatedModal
from "../../components/modals/PantryUpdatedModal";

function ShoppingList() {

  const [items, setItems] =
    useState([]);

  const [showModal,
    setShowModal] =
    useState(false);

  const [newItem,
    setNewItem] =
    useState({

      item_name: "",

      quantity: "",

      unit: "kg"

    });

  useEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    loadShopping();

  }, []);

  const loadShopping =
    async () => {

      try {

        const response =
          await getShopping();

        setItems(
          response.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  const handleAdd =
    async () => {

      try {

        await addShopping({

          item_name:
            newItem.item_name,

          quantity:
            Number(
              newItem.quantity
            ),

          unit:
            newItem.unit,

          status:
            "Pending"

        });

        setNewItem({

          item_name: "",

          quantity: "",

          unit: "kg"

        });

        loadShopping();

      }

      catch (error) {

        console.log(error);

      }

    };

  const toggleStatus =
    async (item) => {

      try {

        await updateShopping(

          item.id,

          {

            quantity:
              item.quantity,

            status:
              item.status ===
              "Pending"

                ?

                "Purchased"

                :

                "Pending"

          }

        );

        loadShopping();

      }

      catch (error) {

        console.log(error);

      }

    };

  const increaseQuantity =
    async (item) => {

      let quantity =
        Number(
          item.quantity
        );

      if (
        item.unit === "kg"
      ) {

        quantity += 0.5;

      }

      else if (
        item.unit === "g"
      ) {

        quantity += 100;

      }

      else {

        quantity += 1;

      }

      await updateShopping(

        item.id,

        {

          quantity,

          status:
            item.status

        }

      );

      loadShopping();

    };

  const decreaseQuantity =
    async (item) => {

      let quantity =
        Number(
          item.quantity
        );

      if (
        item.unit === "kg"
      ) {

        quantity -= 0.5;

      }

      else if (
        item.unit === "g"
      ) {

        quantity -= 100;

      }

      else {

        quantity -= 1;

      }

      if (
        quantity <= 0
      ) {

        return;

      }

      await updateShopping(

        item.id,

        {

          quantity,

          status:
            item.status

        }

      );

      loadShopping();

    };

  const removeItem =
    async (id) => {

      await deleteShopping(
        id
      );

      loadShopping();

    };

  const handleTransfer =
    async () => {

      try {

        await transferToPantry();

        setShowModal(
          true
        );

        loadShopping();

      }

      catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-body">

          <div className="d-flex justify-content-between mb-4">

            <h2>
              Monthly Shopping List
            </h2>
            <div className="row mb-4">

  <div className="col-md-4">

    <div className="card shadow-sm">

      <div className="card-body text-center">

        <h6>
          Total Items
        </h6>

        <h3>

          {items.length}

        </h3>

      </div>

    </div>

  </div>

  <div className="col-md-4">

    <div className="card shadow-sm">

      <div className="card-body text-center">

        <h6>
          Purchased
        </h6>

        <h3>

          {
            items.filter(
              i =>
              i.status ===
              "Purchased"
            ).length
          }

        </h3>

      </div>

    </div>

  </div>

  <div className="col-md-4">

    <div className="card shadow-sm">

      <div className="card-body text-center">

        <h6>
          Pending
        </h6>

        <h3>

          {
            items.filter(
              i =>
              i.status ===
              "Pending"
            ).length
          }

        </h3>

      </div>

    </div>

  </div>

</div>
            <button
              className="btn btn-primary"
              onClick={
                handleTransfer
              }
            >
              Update Pantry
            </button>

          </div>

          <div className="row mb-4">

            <div className="col-md-4">

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

            <div className="col-md-3">

              <input
                type="number"
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
                  g
                </option>

                <option>
                  pcs
                </option>

              </select>

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

          <table className="table table-striped">

            <thead>

              <tr>

                <th>
                  Purchased
                </th>

                <th>
                  Item
                </th>

                <th>
                  Quantity
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              <div className="row">

{

items.length > 0 ?

items.map(item => (

<div
  className="col-md-6 mb-3"
  key={item.id}
>

  <div
    className={`card shadow h-100 ${
      item.status === "Purchased"
      ? "border-success"
      : ""
    }`}
  >

    <div className="card-body">

      <div
        className="d-flex justify-content-between"
      >

        <h5>

          {item.item_name}

        </h5>

        <input
          type="checkbox"
          checked={
            item.status ===
            "Purchased"
          }
          onChange={() =>
            toggleStatus(item)
          }
        />

      </div>

      <p>

        Quantity:

        {" "}

        <strong>

          {item.quantity}
          {" "}
          {item.unit}

        </strong>

      </p>

      <p>

        Status:

        {

          item.status ===
          "Purchased"

          ?

          " ✅ Purchased"

          :

          " 🟡 Pending"

        }

      </p>

      <div>

        <button
          className="btn btn-success me-2"
          onClick={() =>
            increaseQuantity(item)
          }
        >

          +

        </button>

        <button
          className="btn btn-warning me-2"
          onClick={() =>
            decreaseQuantity(item)
          }
        >

          -

        </button>

        <button
          className="btn btn-danger"
          onClick={() =>
            removeItem(item.id)
          }
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

    No Shopping Items Found

  </div>

</div>

}

</div>
            </tbody>

          </table>

        </div>

      </div>

      <PantryUpdatedModal

        show={showModal}

        onClose={() =>
          setShowModal(
            false
          )
        }

      />

    </div>

  );

}

export default ShoppingList;
