import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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



/* ------------------ DASHBOARD ------------------ */
export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [rawGraph, setRawGraph] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          total_topup_amount: d.revenue?.total_topup ?? 0,
        });

        setRawGraph({
          labels: d.revenue?.graph?.labels || [],
          values: d.revenue?.graph?.values || [],
        });
      })
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  const graphData = useMemo(() => {
    if (!fromDate && !toDate) {
      return buildGraph(rawGraph.labels, rawGraph.values);
    }

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const filtered = rawGraph.labels.reduce(
      (acc, label, index) => {
        const current = new Date(label);
        if ((!from || current >= from) && (!to || current <= to)) {
          acc.labels.push(label);
          acc.values.push(rawGraph.values[index]);
        }
        return acc;
      },
      { labels: [], values: [] }
    );

    return buildGraph(filtered.labels, filtered.values);
  }, [rawGraph, fromDate, toDate]);

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.raw}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your platform's key metrics.</p>
        </div>

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

      {/* STATS */}
      <div className="stats-grid">
        <Stat title="Total Users" value={stats.total_users} clickable onClick={() => navigate("/users")} />
        <Stat title="Total Men" value={stats.total_men} clickable onClick={() => navigate("/users?gender=men")} />
        <Stat title="Total Women" value={stats.total_women} clickable onClick={() => navigate("/users?gender=women")} />
        <Stat title="Daily Active Users" value={stats.daily_active_users} clickable onClick={() => navigate("/users?filter=active")} />
        <Stat title="Pending Verifications" value={stats.pending_verifications} danger clickable onClick={() => navigate("/profile-verification")} />
        <Stat title="Total Reports" value={stats.total_reports} clickable onClick={() => navigate("/reports")} />
        <Stat title="Total Revenue" value={`₹${stats.total_revenue}`} clickable onClick={() => navigate("/revenue")} />
        <Stat title="Total Topup Amount" value={`₹${stats.total_topup_amount}`} clickable onClick={() => navigate("/revenue?tab=topup")} />
      </div>

      {/* GRAPH */}
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

function Stat({ title, value, danger, clickable, onClick }) {
  return (
    <div
      className={`stat-card ${danger ? "danger" : ""} ${
        clickable ? "clickable" : ""
      }`}
      onClick={clickable ? onClick : undefined}
      role={clickable ? "button" : undefined}
    >
      <span>{title}</span>
      <h2>{value ?? "-"}</h2>
    </div>
  );
}
