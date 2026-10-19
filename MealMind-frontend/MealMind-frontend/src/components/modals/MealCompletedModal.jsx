function MealCompletedModal({
  show,
  onClose
}) {

  if (!show)
    return null;

  return (

    <div className="modal-backdrop">

      <div className="custom-modal">

        <h2>
          🎉 Meal Logged
        </h2>

        <button
          className="btn btn-success"
          onClick={onClose}
        >
          Continue
        </button>

      </div>

    </div>

  );

}

export default MealCompletedModal;
