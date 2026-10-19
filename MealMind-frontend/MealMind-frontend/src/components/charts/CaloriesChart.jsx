import { useEffect, useState } from "react";

import {

    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    ReferenceLine,
    Rectangle

} from "recharts";

import {

    getWeeklyCalories

} from "../../api/dashboardApi";

function CaloriesChart() {

    const [data, setData] =
    useState([]);
    const [goal, setGoal] =
    useState(0);

    async function loadCalories() {

        try {

            const response =
            await getWeeklyCalories();

            setData(
                response.data.data
            );
            setGoal(response.data.goal);

        }

        catch (error) {

            console.log(error);

        }

    }

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCalories();

    }, []);

    return (

        <ResponsiveContainer
            width="100%"
            height={300}
        >

            <BarChart
                data={data}
                barCategoryGap="45%"
                margin={{
                    top: 24,
                    right: 12,
                    left: 0,
                    bottom: 0
                }}
            >

                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                />

                <XAxis
                    dataKey="day"
                />

                <YAxis
                    width={45}
                />

                <Tooltip />

                {goal > 0 && (
                    <ReferenceLine
                        y={goal}
                        stroke="#dc3545"
                        strokeDasharray="6 4"
                        ifOverflow="extendDomain"
                        label={{
                            value: `Goal ${goal}`,
                            fill: "#dc3545",
                            position: "insideTopRight"
                        }}
                    />
                )}

                <Bar
                    dataKey="calories"
                    fill="#16a34a"
                    maxBarSize={26}
                    shape={(props) => (
                        <g>
                            <Rectangle
                                {...props}
                                radius={[7, 7, 0, 0]}
                            />
                            {
                                goal > 0 &&
                                props.value >= goal &&
                                props.height >= 22 && (
                                    <text
                                        x={props.x + props.width / 2}
                                        y={props.y + 17}
                                        textAnchor="middle"
                                        fill="#ffffff"
                                        fontSize="14"
                                        fontWeight="bold"
                                    >
                                        ✓
                                    </text>
                                )
                            }
                        </g>
                    )}
                />

            </BarChart>

        </ResponsiveContainer>

    );

}

export default CaloriesChart;
