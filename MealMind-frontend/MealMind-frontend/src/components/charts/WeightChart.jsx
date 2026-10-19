import {

  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid

} from "recharts";

function WeightChart() {

  const data = [

    { week: "W1", weight: 60 },

    { week: "W2", weight: 61 },

    { week: "W3", weight: 62 },

    { week: "W4", weight: 63 }

  ];

  return (

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <LineChart data={data}>

        <CartesianGrid
          stroke="#e2e8f0"
          strokeDasharray="4 4"
        />

        <XAxis dataKey="week" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="weight"
          stroke="#16a34a"
          strokeWidth={3}
          dot={{
            fill: "#16a34a",
            stroke: "#ffffff",
            strokeWidth: 2,
            r: 5
          }}
          activeDot={{
            fill: "#15803d",
            r: 7
          }}
        />

      </LineChart>

    </ResponsiveContainer>

  );

}

export default WeightChart;
