import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

function DashboardCharts({ reports }) {
  const data = [
    {
      name: "High",
      value: reports.filter((r) => r.severity === "High").length,
    },
    {
      name: "Medium",
      value: reports.filter((r) => r.severity === "Medium").length,
    },
    {
      name: "Low",
      value: reports.filter((r) => r.severity === "Low").length,
    },
  ];
  const issueData = [
  {
    name: "Pothole",
    value: reports.filter(
      (r) => r.issueType === "Pothole"
    ).length,
  },
  {
    name: "Garbage",
    value: reports.filter(
      (r) => r.issueType === "Garbage"
    ).length,
  },
  {
    name: "Street Light",
    value: reports.filter(
      (r) => r.issueType === "Street Light"
    ).length,
  },
  {
    name: "Water Leak",
    value: reports.filter(
      (r) => r.issueType === "Water Leak"
    ).length,
  },
];
const reportsOverTime = reports.reduce((acc, report) => {
  const date = report.createdAt
    ? new Date(report.createdAt.seconds * 1000)
        .toLocaleDateString()
    : "Unknown";

  const existing = acc.find((item) => item.date === date);

  if (existing) {
    existing.reports += 1;
  } else {
    acc.push({
      date,
      reports: 1,
    });
  }

  return acc;
}, []);

  const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

  return (
  <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

    {/* Pie Chart */}
    <div className="rounded-2xl bg-slate-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        📊 Severity Distribution
      </h2>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={120}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Bar Chart */}
    <div className="rounded-2xl bg-slate-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        📈 Issue Types
      </h2>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={issueData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
   <div className="rounded-2xl bg-slate-900 p-6 lg:col-span-2">
  <h2 className="mb-6 text-2xl font-bold">
    📈 Reports Over Time
  </h2>

  <div style={{ width: "100%", height: 350 }}>
    <ResponsiveContainer>
      <LineChart data={reportsOverTime}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis />

        <Tooltip />

        <Legend />

        <Line
          type="monotone"
          dataKey="reports"
          stroke="#3b82f6"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
  </div>
);
}

export default DashboardCharts;