import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "bootstrap-icons/font/bootstrap-icons.css";
const config = require("../../Apiconfig.js");

// ---------------- Arc Gauge ----------------
const ArcGauge = ({ progress, size = 60, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    if (progress < 40) return "#ef4444"; // red
    if (progress < 70) return "#facc15"; // yellow
    return "#4caf50"; // green
  };

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />

      <motion.circle
        stroke={getColor()}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset, stroke: getColor() }}
        transition={{ duration: 1 }}
      />

      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill={getColor()}
        style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
      >
        {progress}%
      </text>
    </svg>
  );
};

// ---------------- Stat Card ----------------
const StatCard = ({ title, value, change, changeType, currency, initialProgress }) => {
  const isPositive = changeType === "positive";
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const changeAmount = Math.floor(Math.random() * 20) - 10; // simulate +/- change
        return Math.max(0, Math.min(100, prev + changeAmount));
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="col-12 col-sm-6 col-lg-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="shadow-sm border rounded-4 p-4 bg-white d-flex justify-content-between align-items-center"
        style={{ minHeight: "150px" }}
      >
        <div>
          <small className="text-muted">{title}</small>
          <div className="d-flex align-items-baseline gap-1 mt-1">
            {currency && <span className="fw-semibold fs-5">{currency}</span>}
            <span className="fw-bold" style={{ fontSize: "2rem" }}>
              {value}
            </span>
          </div>
          <div
            className={`small fw-medium d-flex align-items-center mt-1 ${
              isPositive ? "text-success" : "text-danger"
            }`}
          >
            <i
              className={`bi ${
                isPositive ? "bi-graph-up-arrow" : "bi-graph-down-arrow"
              } me-1`}
            />
            {change}
          </div>
        </div>

        <ArcGauge progress={progress} size={60} strokeWidth={8} />
      </div>
    </motion.div>
  );
};

// ---------------- Stats Section ----------------
export default function StatsSection() {
  const [patientsCount, setPatientsCount] = useState(null);
  const [incomeCount, setIncomeCount] = useState(null);
  const [discountCount, setDiscountCount] = useState(null);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingIncome, setLoadingIncome] = useState(true);
  const [loadingDiscount, setLoadingDiscount] = useState(true);

  // Fetch Patients
  useEffect(() => {
    const fetchTotalPatients = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/TotalPatients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });
        const data = await res.json();
        const count = Array.isArray(data) && data.length > 0 ? data[0].TotalPatients : 0;
        setPatientsCount(count);
      } catch (err) {
        console.error("Error fetching total patients:", err);
        setPatientsCount(0);
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchTotalPatients();
  }, []);

  // Fetch Income
  useEffect(() => {
    const fetchTotalIncome = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/TotalIncome`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });
        const data = await res.json();
        const totalIncome = Array.isArray(data) && data.length > 0 ? data[0].TotalIncome : 0;
        setIncomeCount(totalIncome);
      } catch (err) {
        console.error("Error fetching total Income:", err);
        setIncomeCount(0);
      } finally {
        setLoadingIncome(false);
      }
    };
    fetchTotalIncome();
  }, []);

  // Fetch Discount
  useEffect(() => {
    const fetchTotalDiscount = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/TotalDiscount`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });
        const data = await res.json();
        const totalDiscount = Array.isArray(data) && data.length > 0 ? data[0].TotalDiscount : 0;
        setDiscountCount(totalDiscount);
      } catch (err) {
        console.error("Error fetching total Discount:", err);
        setDiscountCount(0);
      } finally {
        setLoadingDiscount(false);
      }
    };
    fetchTotalDiscount();
  }, []);

  return (
    <section className="row g-3 mb-4">
      <StatCard
        title="Total Discount"
        value={loadingDiscount ? "Loading..." : discountCount}
        change="+2 since last week"
        changeType="positive"
        initialProgress={70}
      />
      <StatCard
        title="No of Patients"
        value={loadingPatients ? "Loading..." : patientsCount}
        change="-3 since yesterday"
        changeType="negative"
        initialProgress={40}
      />
      <StatCard
        title="Total Income"
        value={loadingIncome ? "Loading..." : incomeCount}
        change="+5 upcoming"
        changeType="positive"
        currency="₹"
        initialProgress={85}
      />
    </section>
  );
}
