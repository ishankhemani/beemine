


import { useEffect, useState } from "react";
import { getRevenueAnalytics } from "../api/revenue.api";
import "../styles/revenue.css";

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

export default function Revenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2026-01-31");

  useEffect(() => {
    fetchRevenue();
    // eslint-disable-next-line
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await getRevenueAnalytics({ fromDate, toDate });
      setData(res);
    } catch (err) {
      console.error("Revenue API error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-loading">Loading revenue…</div>;
  if (!data?.success) return <div>Error loading revenue</div>;

  const summary = data.summary;

  /* CHART DATA */
  const chartData = {
    labels: data.charts.daily_revenue.map((d) => d.day),
    datasets: [
      {
        data: data.charts.daily_revenue.map((d) =>
          Number(d.revenue)
        ),
        backgroundColor: "#2563eb",
        hoverBackgroundColor: "#1d4ed8",
        borderRadius: 8,
        barThickness: 24,
        maxBarThickness: 28,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
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
          font: { size: 12, weight: "500" },
          color: "#6b7280",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
          borderDash: [4, 4],
        },
        ticks: {
          font: { size: 12 },
          color: "#6b7280",
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div className="revenue-page">
      {/* HEADER */}
      <div className="revenue-header">
        <div>
          <h2>Revenue Analytics</h2>
          <p>Track financial performance and spending.</p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="revenue-cards">
        <SummaryCard title="Total Revenue" value={`₹${summary.total_revenue}`} />
        <SummaryCard title="Net Revenue" value={`₹${summary.net_revenue}`} />
        <SummaryCard title="Total Spent" value={`₹${summary.total_spent}`} />
        <SummaryCard
          title="Total Transactions"
          value={summary.total_transactions}
        />
        <SummaryCard title="Avg Topup" value={`₹${summary.average_topup}`} />
                <SummaryCard title="reward given" value={`₹${summary.reward_given}`} />
        
        <SummaryCard
          title="Gift Revenue"
          value={`₹${summary.gift_revenue}`}
          danger
        />
      </div>

      {/* CHART */}
      <div className="revenue-chart-card">
        <div className="chart-header">
          <div>
            <h3>Revenue Over Time</h3>
            <p>Revenue based on selected date range</p>
          </div>

          {/* DATE RANGE */}
          <div className="chart-filters">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button onClick={fetchRevenue}>Apply</button>
          </div>
        </div>

        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

/* SUMMARY CARD */
function SummaryCard({ title, value, danger }) {
  return (
    <div className={`revenue-card ${danger ? "danger" : ""}`}>
      <p className="card-title">{title}</p>
      <h4 className="card-value">{value}</h4>
    </div>
  );
}