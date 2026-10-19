function PantryUpdatedModal({
  show,
  onClose
}) {

  if (!show)
    return null;

  return (

    <div className="modal-backdrop">

      <div className="custom-modal">

        <h3>
          Pantry Updated ✅
        </h3>

        <p>
          Purchased items moved to pantry.
        </p>

        <button
          className="btn btn-success"
          onClick={onClose}
        >
          OK
        </button>

      </div>

    </div>

  );

}

export default PantryUpdatedModal;