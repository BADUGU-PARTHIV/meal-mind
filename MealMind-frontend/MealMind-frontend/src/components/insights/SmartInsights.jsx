function SmartInsights() {

  const insights = [

    "Protein intake is 20g below target",

    "Drink 500ml more water",

    "Fiber intake low today",

    "Eggs running low in pantry"

  ];

  return (

    <div className="card shadow-sm">

      <div className="card-body">

        <h4>
          Smart Insights
        </h4>

        <ul>

          {
            insights.map(
              (item, index) => (

                <li key={index}>
                  {item}
                </li>

              )
            )
          }

        </ul>

      </div>

    </div>

  );

}

export default SmartInsights;