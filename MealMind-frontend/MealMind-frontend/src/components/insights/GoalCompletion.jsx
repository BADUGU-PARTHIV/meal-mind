function GoalCompletion() {

  return (

    <div className="card shadow-sm">

      <div className="card-body">

        <h4>
          Goal Completion
        </h4>

        <h1>
          82%
        </h1>

        <div
          className="progress"
          style={{
            height: "12px"
          }}
        >

          <div
            className="progress-bar"
            style={{
              width: "82%"
            }}
          />

        </div>

      </div>

    </div>

  );

}

export default GoalCompletion;