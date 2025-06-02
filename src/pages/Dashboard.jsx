import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import {
  FaMoneyBillWave,
  FaChartPie,
  FaClock,
  FaFileExport,
  FaFileImport,
} from "react-icons/fa";
import {
  exportToCSV,
  exportToJSON,

} from "../utils/exportUtils";
import { importFromJSON } from "../utils/importUtils";
import "./../App.css";

export default function Dashboard() {
  const { addMultipleTransactions, transactions, defaultCurrency } =
    useContext(TransactionContext);

  // Safely calculate total
  const rawTotal = transactions.reduce((sum, t) => {
    const value = parseFloat(t.convertedAmount ?? t.amount);
    return !isNaN(value) ? sum + value : sum;
  }, 0);
  const total = isNaN(rawTotal) ? "0.00" : rawTotal.toFixed(2);

  const recent = transactions[transactions.length - 1];

  // Safely calculate category totals
  const categoryTotals = transactions.reduce((acc, t) => {
    const value = parseFloat(t.convertedAmount ?? t.amount);
    if (!isNaN(value)) {
      acc[t.category] = (acc[t.category] || 0) + value;
    }
    return acc;
  }, {});
  const mostSpentCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <section className="dashboard-container">
      <header>
        <h1 className="page-title yellow">Dashboard Overview</h1>
      </header>

      <nav className="export-bar" aria-label="Export and Import Buttons">
        <button
          className="export-button green"
          onClick={() => importFromJSON(addMultipleTransactions)}
        >
          <FaFileImport className="icon" /> Import JSON
        </button>
        <button
          className="export-button blue"
          onClick={() => exportToCSV(transactions)}
        >
          <FaFileExport className="icon" /> Export CSV
        </button>
        <button
          className="export-button purple"
          onClick={() => exportToJSON(transactions)}
        >
          <FaFileExport className="icon" /> Export JSON
        </button>

      </nav>

      <section className="dashboard-grid">
        {/* Total Transactions */}
        <article className="dashboard-card">
          <FaMoneyBillWave className="dashboard-icon green" />
          <h2 className="dashboard-heading">Total Spent</h2>
          <p className="dashboard-value">
            {total} {defaultCurrency}
          </p>
        </article>

        {/* Most Spent Category */}
        <article className="dashboard-card">
          <FaChartPie className="dashboard-icon blue" />
          <h2 className="dashboard-heading">Most Spent Category</h2>
          {mostSpentCategory && !isNaN(mostSpentCategory[1]) ? (
            <p className="dashboard-value">
              {mostSpentCategory[0]} ({mostSpentCategory[1].toFixed(2)}{" "}
              {defaultCurrency})
            </p>
          ) : (
            <p className="dashboard-note">No transactions yet</p>
          )}
        </article>

        {/* Recent Transaction */}
        <article className="dashboard-card">
          <FaClock className="dashboard-icon yellow" />
          <h2 className="dashboard-heading">Most Recent</h2>
          {recent ? (
            <>
              <p className="dashboard-recent-name">{recent.name}</p>
              <p className="dashboard-note">
                {recent.date} • {recent.category}
              </p>
              <p className="dashboard-amount">
                {!isNaN(parseFloat(recent.convertedAmount ?? recent.amount))
                  ? parseFloat(recent.convertedAmount ?? recent.amount).toFixed(2)
                  : "0.00"}{" "}
                {defaultCurrency}
              </p>
            </>
          ) : (
            <p className="dashboard-note">No transactions yet</p>
          )}
        </article>
      </section>
    </section>
  );
}
