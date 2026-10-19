function WaterTrackerCard() {

  return (

    <div className="card shadow-sm h-100">

      <div className="card-body">

        <h5>Water Intake</h5>

        <h2>
          2.4 / 3 L
        </h2>

        <button
          className="btn btn-primary me-2"
        >
          +250ml
        </button>

        <button
          className="btn btn-success me-2"
        >
          +500ml
        </button>

        <button
          className="btn btn-warning"
        >
          +1L
        </button>

      </div>

    </div>

  );

}

export default WaterTrackerCard;