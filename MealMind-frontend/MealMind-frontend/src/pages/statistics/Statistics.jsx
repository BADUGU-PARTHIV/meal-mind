import { useCallback, useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { getStatistics } from "../../api/statisticsApi";
import LogMealModal from "../../components/modals/LogMealModal";

const today = () => {
    const now = new Date();
    return new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    )
        .toISOString()
        .split("T")[0];
};

const metrics = {
    calories: { label: "Calories", unit: "kcal", color: "#16a34a" },
    protein: { label: "Protein", unit: "g", color: "#2563eb" },
    carbs: { label: "Carbs", unit: "g", color: "#f59e0b" },
    fat: { label: "Fat", unit: "g", color: "#ef4444" },
    fiber: { label: "Fiber", unit: "g", color: "#8b5cf6" }
};

function Statistics() {
    const [period, setPeriod] = useState("weekly");
    const [anchorDate, setAnchorDate] = useState(today);
    const [metric, setMetric] = useState("calories");
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMissedDate, setSelectedMissedDate] = useState(null);

    const loadStatistics = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getStatistics(
                period,
                anchorDate
            );
            setStatistics(response.data);
        }
        catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                "Unable to load statistics."
            );
        }
        finally {
            setLoading(false);
        }
    }, [anchorDate, period]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadStatistics();
    }, [loadStatistics]);

    const selectedMetric = metrics[metric];
    const goal = Number(
        statistics?.goals?.[metric] || 0
    );

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Nutrition Statistics
                    </h2>
                    <p className="text-muted mb-0">
                        Review your progress and fill in meals you missed.
                    </p>
                </div>

                <div className="d-flex gap-2 flex-wrap">
                    <input
                        type="date"
                        className="form-control"
                        style={{ width: "180px" }}
                        value={anchorDate}
                        max={today()}
                        onChange={(event) =>
                            setAnchorDate(event.target.value)
                        }
                    />
                    <button
                        className="btn btn-success"
                        onClick={() =>
                            setSelectedMissedDate(anchorDate)
                        }
                    >
                        + Add Meal for This Date
                    </button>
                </div>
            </div>

            <div className="d-flex gap-2 flex-wrap mb-4">
                {["daily", "weekly", "monthly", "yearly"].map(item => (
                    <button
                        key={item}
                        className={
                            period === item
                                ? "btn btn-success"
                                : "btn btn-outline-success"
                        }
                        onClick={() => setPeriod(item)}
                    >
                        {item[0].toUpperCase() + item.slice(1)}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="text-center py-5">
                    Loading statistics...
                </div>
            )}

            {!loading && statistics && (
                <>
                    <div className="row g-3 mb-4">
                        {Object.entries(metrics).map(([key, item]) => (
                            <div className="col-sm-6 col-xl" key={key}>
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body">
                                        <small className="text-muted">
                                            {item.label}
                                        </small>
                                        <h4 className="mb-0">
                                            {Math.round(
                                                statistics.summary[key]
                                            )}{" "}
                                            <small className="fs-6">
                                                {item.unit}
                                            </small>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                                <div>
                                    <h4 className="mb-1">
                                        {selectedMetric.label} Progress
                                    </h4>
                                    <small className="text-muted">
                                        {statistics.start_date} to{" "}
                                        {statistics.end_date}
                                    </small>
                                </div>

                                <select
                                    className="form-select"
                                    style={{ width: "160px" }}
                                    value={metric}
                                    onChange={(event) =>
                                        setMetric(event.target.value)
                                    }
                                >
                                    {Object.entries(metrics).map(
                                        ([key, item]) => (
                                            <option key={key} value={key}>
                                                {item.label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <ResponsiveContainer width="100%" height={330}>
                                <BarChart
                                    data={statistics.data}
                                    barCategoryGap="35%"
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="label"
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [
                                            `${Math.round(value)} ${selectedMetric.unit}`,
                                            selectedMetric.label
                                        ]}
                                    />
                                    {goal > 0 && period !== "yearly" && (
                                        <ReferenceLine
                                            y={goal}
                                            stroke="#dc3545"
                                            strokeDasharray="6 4"
                                            label={{
                                                value: `Daily goal: ${goal}`,
                                                fill: "#dc3545",
                                                position: "insideTopRight"
                                            }}
                                        />
                                    )}
                                    <Bar
                                        dataKey={metric}
                                        fill={selectedMetric.color}
                                        maxBarSize={28}
                                        radius={[7, 7, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h4 className="mb-3">
                                Missed-day Insights
                            </h4>

                            {statistics.missed_days.length === 0 ? (
                                <div className="alert alert-success mb-0">
                                    You have no missed meal-log days in this period.
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-2">
                                    {statistics.missed_days.map(day => (
                                        <div
                                            key={day.date}
                                            className="alert alert-warning d-flex justify-content-between align-items-center flex-wrap gap-2 mb-0"
                                        >
                                            <span>💡 {day.message}</span>
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() =>
                                                    setSelectedMissedDate(day.date)
                                                }
                                            >
                                                Add Meal
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            <LogMealModal
                key={selectedMissedDate || "closed"}
                show={Boolean(selectedMissedDate)}
                consumedDate={selectedMissedDate}
                onClose={() => setSelectedMissedDate(null)}
                onSaved={() => {
                    setSelectedMissedDate(null);
                    loadStatistics();
                }}
                onEntriesChanged={loadStatistics}
            />
        </div>
    );
}

export default Statistics;
