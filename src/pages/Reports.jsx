import { useContext, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ChartIcon from "../assets/chart.svg";
import CalendarIcon from "../assets/calendar.svg";
import SvgCategoryCloud from "../components/SvgCategoryCloud";
import "./../App.css";

// Helper to group data by time
function groupTransactionsBy(transactions, type) {
  const groupedData = {};

  transactions.forEach((transaction) => {
    let key;
    const date = new Date(transaction.date);

    if (type === "day") key = date.toISOString().split("T")[0];
    if (type === "month") key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (type === "year") key = `${date.getFullYear()}`;

    if (!groupedData[key]) groupedData[key] = 0;
    groupedData[key] += Number(transaction.amount);
  });

  return Object.entries(groupedData).map(([key, amount]) => ({
    key,
    amount
  }));
}

export default function Reports() {
  const { transactions } = useContext(TransactionContext);

  const dailyData = groupTransactionsBy(transactions, "day");
  const monthlyData = groupTransactionsBy(transactions, "month");
  const yearlyData = groupTransactionsBy(transactions, "year");

  const initialCharts = [
    { id: "daily", title: "Expenses by Day", data: dailyData, color: "#f87171" },
    { id: "monthly", title: "Expenses by Month", data: monthlyData, color: "#60a5fa" },
    { id: "yearly", title: "Expenses by Year", data: yearlyData, color: "#34d399" }
  ];

  const [chartOrder, setChartOrder] = useState(initialCharts);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(chartOrder);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setChartOrder(reordered);
  };

  return (
    <main className="reports-container">
      <header>
        <h1 className="page-title green">
          <img src={ChartIcon} alt="Reports" className="icon-lg" />
          Expense Reports
        </h1>
      </header>

      {transactions.length > 0 ? (
        <>
          <section className="reports-card">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="charts">
                {(provided) => (
                  <section {...provided.droppableProps} ref={provided.innerRef}>
                    {chartOrder.map((chart, index) => (
                      <Draggable key={chart.id} draggableId={chart.id} index={index}>
                        {(provided) => (
                          <article
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="chart-section"
                          >
                            <header>
                              <h2 className="chart-title">
                                <img src={CalendarIcon} alt={chart.id} className="icon-md" />
                                {chart.title}
                              </h2>
                            </header>
                            <div style={{ width: "100%", height: 300 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chart.data}>
                                  <XAxis dataKey="key" stroke="#ddd" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Bar dataKey="amount" fill={chart.color} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </article>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </section>
                )}
              </Droppable>
            </DragDropContext>
          </section>

          {/* New SVG Category Cloud */}
          <section className="reports-card">
            <SvgCategoryCloud transactions={transactions} />
          </section>
        </>
      ) : (
        <p className="no-transactions">No transactions available for reporting.</p>
      )}
    </main>
  );
}
