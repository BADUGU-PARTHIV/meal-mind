import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { getDashboard } from "../../api/dashboardApi";

function MacroChart() {

    const [data, setData] =
    useState([]);

    useEffect(() => {

        // eslint-disable-next-line react-hooks/immutability
        loadData();

    }, []);

    const loadData =
    async () => {

        try {

            const response =
            await getDashboard();

            setData([

                {

                    name: "Protein",

                    value:
                    Number(
                        response.data.totalProtein
                    )

                },

                {

                    name: "Carbs",

                    value:
                    Number(
                        response.data.totalCarbs
                    )

                },

                {

                    name: "Fat",

                    value:
                    Number(
                        response.data.totalFat
                    )

                }

            ]);

        }

        catch(error){

            console.log(error);

        }

    };

    const colors = [

        "#16a34a",

        "#3b82f6",

        "#f59e0b"

    ];

    return(

        <ResponsiveContainer
            width="100%"
            height={300}
        >

            <PieChart>

                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={100}
                >

                    {

                        data.map((item,index)=>(

                            <Cell
                                key={index}
                                fill={colors[index]}
                            />

                        ))

                    }

                </Pie>

                <Tooltip/>

                <Legend/>

            </PieChart>

        </ResponsiveContainer>

    );

}

export default MacroChart;
