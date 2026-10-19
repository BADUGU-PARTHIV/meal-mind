function GoalProgress() {

  return (

    <div className="card shadow-sm h-100">

      <div className="card-body">

        <h5>Daily Goal Completion</h5>

        <h1 className="mt-4">
          82%
        </h1>

        <div
          className="progress mt-3"
          style={{ height: "12px" }}
        >

          <div
            className="progress-bar"
            style={{ width: "82%" }}
          />

        </div>

        <p className="mt-3">
          Great progress today
        </p>

      </div>

    </div>

  );

}

export default GoalProgress;