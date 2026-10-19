function ShoppingGeneratedModal({
  show,
  onClose,
  onView
}) {

  if (!show)
    return null;

  return (

    <div className="modal-backdrop">

      <div className="custom-modal">

        <h3>
          Monthly Plan Generated 🎉
        </h3>

        <p>
          Shopping list has been created.
        </p>

        <div className="d-flex gap-2">

          <button
            className="btn btn-success"
            onClick={onView}
          >
            View Shopping List
          </button>

          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Later
          </button>

        </div>

      </div>

    </div>

  );

}

export default ShoppingGeneratedModal;