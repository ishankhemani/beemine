import { useEffect, useMemo, useState } from "react";
import { getDashboardStats } from "../api/dashboard.api";
import "../styles/dashboard.css";

/* Chart.js */
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [rawGraph, setRawGraph] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Date range */
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    setLoading(true);
    getDashboardStats()
      .then((res) => {
        const d = res.data;

        setStats({
          total_users: d.users?.total_active ?? 0,
          total_men: d.users?.men ?? 0,
          total_women: d.users?.women ?? 0,
          daily_active_users: d.active_users?.daily ?? 0,
          pending_verifications: d.verification?.pending_profiles ?? 0,
          total_reports: d.reports?.pending ?? 0,
          total_revenue: d.revenue?.platform_85_percent ?? 0,
        });

        setRawGraph({
          labels: d.revenue?.graph?.labels || [],
          values: d.revenue?.graph?.values || [],
        });
      })
      .catch((err) =>
        setError(err?.message || "Failed to load dashboard data")
      )
      .finally(() => setLoading(false));
  }, []);

  /* Filter graph by date range */
  const graphData = useMemo(() => {
    if (!fromDate && !toDate) {
      return buildGraph(rawGraph.labels, rawGraph.values);
    }

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const filtered = rawGraph.labels.reduce(
      (acc, label, index) => {
        const current = new Date(label);
        if (
          (!from || current >= from) &&
          (!to || current <= to)
        ) {
          acc.labels.push(label);
          acc.values.push(rawGraph.values[index]);
        }
        return acc;
      },
      { labels: [], values: [] }
    );

    return buildGraph(filtered.labels, filtered.values);
  }, [rawGraph, fromDate, toDate]);

  if (loading)
    return <div className="loading-state">Loading dashboard data...</div>;

  if (error) return <div className="error-state">{error}</div>;

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (ctx) => ` ₹${ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 8,
          color: "#6b7280",
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
          borderDash: [4, 4],
        },
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p className="dashboard-subtitle">
            Overview of your platform's key metrics.
          </p>
        </div>

        {/* DATE RANGE FILTER */}
        <div className="dashboard-actions">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-grid">
        <Stat title="Total Users" value={stats.total_users} />
        <Stat title="Total Men" value={stats.total_men} />
        <Stat title="Total Women" value={stats.total_women} />
        <Stat title="Daily Active Users" value={stats.daily_active_users} />
        <Stat
          title="Pending Verifications"
          value={stats.pending_verifications}
          danger
        />
        <Stat title="Total Reports" value={stats.total_reports} />
        <Stat title="Total Revenue" value={`₹${stats.total_revenue}`} />
      </div>

      <div className="dashboard-graphs">
        <div className="graph-card large">
          <div className="graph-header">
            <h3>Revenue Trend</h3>
            <p>Daily platform revenue</p>
          </div>

          <div className="graph-body">
            <Bar data={graphData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helpers */
function buildGraph(labels, values) {
  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "#2563eb",
        hoverBackgroundColor: "#1d4ed8",
        borderRadius: 6,
        barThickness: 22,
        maxBarThickness: 26,
        categoryPercentage: 0.7,
        barPercentage: 0.8,
      },
    ],
  };
}

function Stat({ title, value, danger }) {
  return (
    <div className={`stat-card ${danger ? "danger" : ""}`}>
      <span>{title}</span>
      <h2>{value ?? "-"}</h2>
    </div>
  );
}
