function ProgressCard({

    title,

    value = 0,

    goal = 0,

    progress = 0,

    unit = ""

}) {

    const safeProgress =
        Math.min(
            100,
            Math.max(
                0,
                Number(progress || 0)
            )
        );

    return (

        <div className="card shadow-sm h-100">

            <div className="card-body">

                <h6>{title}</h6>

                <h5>

                    {value} / {goal} {unit}

                </h5>

                <div className="progress mt-3">

                    <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{

                            width: `${safeProgress}%`

                        }}
                    >

                        {safeProgress}%

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ProgressCard;
